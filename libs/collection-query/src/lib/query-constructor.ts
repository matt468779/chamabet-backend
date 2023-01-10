import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm';
import { FilterOperators } from './filter_operators';
import { CollectionQuery } from './collection-query';

export class QueryConstructor {
  static constructQuery<T>(
    q1: Repository<T>,
    query: CollectionQuery
  ): SelectQueryBuilder<T> {
    try {
      const langs = ['am', 'en'];
      const aggregateColumns: any = {};
      const metaData = q1.manager.connection.getMetadata(q1.target);
      metaData.columns.map((c) => {
        aggregateColumns[c.databasePath] = c.type;
      });
      console.log(aggregateColumns);
      const {
        top,
        skip,
        searchFrom,
        filter,
        search,
        orderBy,
        includes,
        select,
        locale,
        groupBy,
      } = query;
      const aggregate = this.toSnackCase(metaData.tableName);
      const q = q1.createQueryBuilder(aggregate);
      if (select) {
        q.select(
          select.map((s) => {
            return s.indexOf('.') === -1 ? `${aggregate}.${s}` : s;
          })
        );
      }
      if (includes) {
        includes.forEach((include) => {
          q.leftJoinAndSelect(`${aggregate}.${include}`, include);
        });
      }
      //Filtering goes here
      if (filter) {
        filter.forEach((filters, index) => {
          let filterString = '';
          const filterParams: any = {};
          filters.forEach((f: any, filterIndex) => {
            const paramKey = filterIndex + '_' + index;
            const columnName =
              f.field.indexOf('.') === -1 ? `${aggregate}.${f.field}` : f.field;
            switch (f.operator) {
              case FilterOperators.EqualTo: {
                if (aggregateColumns[f.field] === 'jsonb') {
                  langs.forEach((lang, i) => {
                    filterString +=
                      i === 0 && filterIndex === 0
                        ? ` ${columnName}->>'${lang}' = :${f.field}${lang}${paramKey} `
                        : ` OR ${columnName}->>'${lang}' = :${f.field}${lang}${paramKey} `;
                    filterParams[`${f.field}${lang}${paramKey}`] = f.value;
                  });
                } else {
                  filterString +=
                    filterIndex === 0
                      ? ` ${columnName} = :${f.field}${paramKey} `
                      : ` OR ${columnName} = :${f.field}${paramKey} `;
                  filterParams[`${f.field}${paramKey}`] = f.value;
                }
                break;
              }
              case FilterOperators.Between: {
                if (Array.isArray(f.value)) {
                  if (f.value.length >= 2) {
                    filterString +=
                      filterIndex === 0
                        ? ` (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `
                        : ` OR (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `;
                    filterParams[`${f.field}${paramKey}1`] = f.value[0];
                    filterParams[`${f.field}${paramKey}2`] = f.value[1];
                  }
                } else {
                  const values = f.value.split(',');
                  filterString +=
                    filterIndex === 0
                      ? ` (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `
                      : ` OR (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `;
                  filterParams[`${f.field}${paramKey}1`] = values[0];
                  filterParams[`${f.field}${paramKey}2`] = values[1];
                }
                break;
              }
              case FilterOperators.LessThan: {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} < :${f.field}${paramKey} `
                    : ` OR ${columnName} < :${f.field}${paramKey} `;
                filterParams[`${f.field}${paramKey}`] = f.value;
                break;
              }
              case FilterOperators.LessThanOrEqualTo: {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} <= :${f.field}${paramKey} `
                    : ` OR ${columnName} <= :${f.field}${paramKey} `;
                filterParams[`${f.field}${paramKey}`] = f.value;
                break;
              }
              case FilterOperators.GreaterThan: {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} > :${f.field}${paramKey} `
                    : ` OR ${columnName} > :${f.field}${paramKey} `;
                filterParams[`${f.field}${paramKey}`] = f.value;

                break;
              }
              case FilterOperators.GreaterThanOrEqualTo: {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} >= :${f.field}${paramKey} `
                    : ` OR ${columnName} >= :${f.field}${paramKey} `;
                filterParams[`${f.field}${paramKey}`] = f.value;

                break;
              }
              case FilterOperators.In: {
                if (Array.isArray(f.value)) {
                  filterString +=
                    filterIndex === 0
                      ? ` ${columnName} IN(:...${f.field}${paramKey}) `
                      : ` OR ${columnName} IN(:...${f.field}${paramKey}) `;
                  filterParams[`${f.field}${paramKey}`] = f.value;
                } else {
                  const values = f.value.split(',');
                  filterString +=
                    filterIndex === 0
                      ? ` ${columnName} IN(:...${f.field}${paramKey}) `
                      : ` OR ${columnName} IN(:...${f.field}${paramKey}) `;
                  filterParams[`${f.field}${paramKey}`] = values;
                }
                break;
              }
              case FilterOperators.Any: {
                if (Array.isArray(f.value)) {
                  filterString +=
                    filterIndex === 0
                      ? ` ${columnName} = ANY(:${f.field}${paramKey}) `
                      : ` OR ${columnName} = ANY(:${f.field}${paramKey}) `;
                  filterParams[`${f.field}${paramKey}`] = f.value;
                } else {
                  const values = f.value.split(',');
                  filterString +=
                    filterIndex === 0
                      ? ` ${columnName} = ANY(:${f.field}${paramKey}) `
                      : ` OR ${columnName} = ANY(:${f.field}${paramKey}) `;
                  filterParams[`${f.field}${paramKey}`] = values;
                }
                break;
              }
              case FilterOperators.NotNull: {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} is not null `
                    : ` OR ${columnName} is not null `;
                break;
              }
              case FilterOperators.IsNull: {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} is null `
                    : ` OR ${columnName} is null `;
                break;
              }

              case FilterOperators.NotEqualTo: {
                if (aggregateColumns[f.field] === 'jsonb') {
                  langs.forEach((lang, i) => {
                    filterString +=
                      i === 0 && filterIndex === 0
                        ? ` ${columnName}->>'${lang}' != :${f.field}${lang}${paramKey} `
                        : ` OR ${columnName}->>'${lang}' != :${f.field}${lang}${paramKey} `;
                    filterParams[`${f.field}${lang}${paramKey}`] = f.value;
                  });
                } else {
                  filterString +=
                    filterIndex === 0
                      ? ` ${columnName} != :${f.field}${paramKey} `
                      : ` OR ${columnName} != :${f.field}${paramKey} `;
                  filterParams[`${f.field}${paramKey}`] = f.value;
                }
                break;
              }
              case FilterOperators.Like: {
                if (aggregateColumns[f.field] === 'jsonb') {
                  langs.forEach((lang, i) => {
                    filterString +=
                      i === 0 && filterIndex === 0
                        ? ` ${columnName}->>'${lang}' ilike :${f.field}${lang}${paramKey} `
                        : ` OR ${columnName}->>'${lang}' ilike :${f.field}${lang}${paramKey} `;
                    filterParams[
                      `${f.field}${lang}${paramKey}`
                    ] = `%${f.value}%`;
                  });
                } else {
                  filterString +=
                    filterIndex === 0
                      ? ` ${columnName} ilike :${f.field}${paramKey} `
                      : ` OR ${columnName} ilike :${f.field}${paramKey} `;
                  filterParams[`${f.field}${paramKey}`] = `%${f.value}%`;
                }
                break;
              }
              case FilterOperators.NotIn:
                if (Array.isArray(f.value)) {
                  filterString +=
                    filterIndex === 0
                      ? ` ${columnName} NOT IN(:...${f.field}${paramKey}) `
                      : ` OR ${columnName} NOT IN(:...${f.field}${paramKey}) `;
                  filterParams[`${f.field}${paramKey}`] = f.value;
                } else {
                  const values = f.value.split(',');
                  filterString +=
                    filterIndex === 0
                      ? ` ${columnName} NOT IN(:...${f.field}${paramKey}) `
                      : ` OR ${columnName} NOT IN(:...${f.field}${paramKey}) `;
                  filterParams[`${f.field}${paramKey}`] = values;
                }
                break;
            }
          });
          index === 0
            ? q.where(`(${filterString})`, filterParams)
            : q.andWhere(`(${filterString})`, filterParams);
        });
      }
      if (search && searchFrom) {
        let searchQuery = '';
        const searchParams: any = {};
        console.log(q.getSql())
        searchFrom.forEach((item: string, index: number) => {
          const paramKey = 'search_' + item;
          if (aggregateColumns[item] === 'jsonb') {
            langs.forEach((lang, i) => {
              searchQuery +=
                i === 0 && index === 0
                  ? ` ${aggregate}.${item}->>'${lang}' ilike :${paramKey}${lang} `
                  : ` OR ${aggregate}.${item}->>'${lang}' ilike :${paramKey}${lang} `;
              searchParams[`${paramKey}${lang}`] = `%${search}%`;
            });
          } else {
            if(item.includes('.')){
              searchQuery +=
              index === 0
                ? ` ${item} ilike :${paramKey} `
                : ` OR ${item} ilike :${paramKey} `;
            searchParams[paramKey] = `%${search}%`;
            }else{
              searchQuery +=
              index === 0
                ? ` ${aggregate}.${item} ilike :${paramKey} `
                : ` OR ${aggregate}.${item} ilike :${paramKey} `;
            searchParams[paramKey] = `%${search}%`;
            }
           
          }
        });
        q.andWhere(`(${searchQuery})`, searchParams);
      }

      // start

      if (!(search && searchFrom) && search) {
        let searchQuery = '';
        const searchParams: any = {};
        const fields = [];
       console.log( q.getSql())

        Object.keys(aggregateColumns).forEach((item: string, index: number) => {
          console.log(index, item);
          if (
            aggregateColumns[item] !== 'jsonb' &&
            aggregateColumns[item] !== 'date'&&
            aggregateColumns[item] !== 'boolean'
          ) {
            if (typeof aggregateColumns[item]() === 'string') {
              fields.push(item);
            }
          } 
        });

        if (fields.length > 0) {
          fields.forEach((item: string, index: number) => {
            const paramKey = 'search_' + item;

            console.log('ok', item);
            searchQuery +=
              index === 0
                ? ` ${aggregate}.${item} ilike :${paramKey} `
                : ` OR ${aggregate}.${item} ilike :${paramKey} `;
            searchParams[paramKey] = `%${search}%`;

            console.log('ok', searchQuery);
          });

          q.andWhere(`(${searchQuery})`, searchParams);
        }
      }

      //end
      if (groupBy) {
        groupBy.forEach((item, index) => {
          index === 0
            ? q.groupBy(`${aggregate}.${item}`)
            : q.addGroupBy(`${aggregate}.${item}`);
        });
      }
      if (orderBy) {
        const orderedBy: any = {};
        orderBy.forEach((order) => {
          orderedBy[order.field.includes('.')?`${order.field}`:`${aggregate}.${order.field}`] =
            order.direction?.toUpperCase();
        });
        q.orderBy(orderedBy);
      }
      if (top) {
        q.take(top);
      }
      if (skip) {
        q.skip(skip);
      }
      return q;
    } catch (error: any) { 
      
      throw new Error(error);
    }
  }
  static toSnackCase(text: string) {
    const result = text.trim().replace(/([A-Z])/g, ' $1');
    const upperStr = result.split(' ');
    const lowerArray = upperStr.map((t) => {
      return t.toLocaleLowerCase();
    });
    return lowerArray.join('_');
  }
}
