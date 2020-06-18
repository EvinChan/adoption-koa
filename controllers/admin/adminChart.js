const {exec} = require('../../db/msyql')

// 首页dashboard
exports.getDashBoardData = async (db) => {
  let sql = `SELECT count(*) AS count FROM ${db}`
  if (db === 't_organization') {
    sql += ` WHERE org_status=2`
  }
  const rows = await exec(sql)
  return rows[0].count
// t_user t_pet t_order
// SELECT count(*) AS count FROM t_user
// t_organization
// SELECT count(*) AS count FROM t_user WHERE org_status=2
}

// 首页chart
exports.getDashBoardChart = async (db) => {
let sql1 = `SELECT a.date,ifnull(b.count, 0) AS count
              FROM (
                SELECT date_sub(CURDATE(), INTERVAL 1 DAY) AS date UNION ALL
                SELECT date_sub(CURDATE(), INTERVAL 2 DAY) AS date UNION ALL
                SELECT date_sub(CURDATE(), INTERVAL 3 DAY) AS date UNION ALL
                SELECT date_sub(CURDATE(), INTERVAL 4 DAY) AS date UNION ALL
                SELECT date_sub(CURDATE(), INTERVAL 5 DAY) AS date UNION ALL
                SELECT date_sub(CURDATE(), INTERVAL 6 DAY) AS date UNION ALL
                SELECT date_sub(CURDATE(), INTERVAL 7 DAY) AS date
              ) a
              LEFT JOIN (`
  let sql2 = `SELECT date(gmt_create) AS datetime, count(*) AS count
              FROM ${db}
              GROUP BY date(gmt_create)
              ) b ON a.date = b.datetime
              ORDER BY a.date;`
  let sql3 = `SELECT date(gmt_modified) AS datetime, count(*) AS count
              FROM ${db}
              WHERE org_status=2
              GROUP BY date(gmt_modified)
              ) b ON a.date = b.datetime
              ORDER BY a.date;`
  let sql = ''
  if (db === 't_organization') {
    sql = sql1 + sql3
  } else {
    sql = sql1 + sql2
  }
  return await exec(sql)
//   t_user t_pet t_order
//   SELECT a.date,ifnull(b.count, 0) AS count
//   FROM (
//     SELECT date_sub(CURDATE(), INTERVAL 1 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 2 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 3 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 4 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 5 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 6 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 7 DAY) AS date
//   ) a
//   LEFT JOIN (
//     SELECT date(gmt_create) AS datetime, count(*) AS count
//     FROM ${db}
//     GROUP BY date(gmt_create)
//   ) b ON a.date = b.datetime
//   ORDER BY a.date;
//   t_organization
//   SELECT a.date,ifnull(b.count, 0) AS count
//   FROM (
//     SELECT date_sub(CURDATE(), INTERVAL 1 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 2 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 3 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 4 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 5 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 6 DAY) AS date UNION ALL
//     SELECT date_sub(CURDATE(), INTERVAL 7 DAY) AS date
//   ) a
//   LEFT JOIN (
//     SELECT date(gmt_create) AS datetime, count(*) AS count
//     FROM ${db}
//     WHERE org_status=2
//     GROUP BY date(gmt_modified)
//   ) b ON a.date = b.datetime
//   ORDER BY a.date;
}

// 数据报表 查询某月宠物新增数量
exports.getStatementChart1Data = async (value1) => {
  let data1 = value1 + '-'
  let data2 = value1+ '-01'
  let sql = `SELECT a.date,ifnull(b.count, 0) AS count
             FROM (
               SELECT CONCAT('${data1}',date_table.stats_day) AS date
               FROM date_table
               WHERE date_table.stats_day <= DAYOFMONTH(LAST_DAY('${data2}'))
             ) a
             LEFT JOIN (
               SELECT date(gmt_create) AS datetime, count(*) AS count
               FROM t_pet
               WHERE DATE_FORMAT(t_pet.gmt_create,'%Y-%m')='${value1}'
               GROUP BY date(gmt_create)
             ) b ON a.date = b.datetime
             ORDER BY a.date;`
  return await exec(sql)
//   SELECT a.date,ifnull(b.count, 0) AS count
//   FROM (
//     SELECT CONCAT('2020-03-',date_table.stats_day) AS date
//     FROM date_table
//     WHERE date_table.stats_day <= DAYOFMONTH(LAST_DAY('2020-03-01'))
//   ) a
//   LEFT JOIN (
//     SELECT date(gmt_create) AS datetime, count(*) AS count
//     FROM t_pet
//     WHERE DATE_FORMAT(t_pet.gmt_create,'%Y-%m')='2020-03'
//     GROUP BY date(gmt_create)
//   ) b ON a.date = b.datetime
//   ORDER BY a.date;
}

// 数据报表 查询某月订单数量
exports.getStatementChart2Data = async (value2) => {
  let data1 = value2 + '-'
  let data2 = value2+ '-01'
  let sql = `SELECT a.date,ifnull(b.count, 0) AS count
             FROM (
               SELECT CONCAT('${data1}',date_table.stats_day) AS date
               FROM date_table
               WHERE date_table.stats_day <= DAYOFMONTH(LAST_DAY('${data2}'))
             ) a
             LEFT JOIN (
               SELECT date(gmt_create) AS datetime, count(*) AS count
               FROM t_order
               WHERE DATE_FORMAT(t_order.gmt_create,'%Y-%m')='${value2}'
               GROUP BY date(gmt_create)
             ) b ON a.date = b.datetime
             ORDER BY a.date;`
  return await exec(sql)
//   SELECT a.date,ifnull(b.count, 0) AS count
//   FROM (
//     SELECT CONCAT('2020-03-',date_table.stats_day) AS date
//     FROM date_table
//     WHERE date_table.stats_day <= DAYOFMONTH(LAST_DAY('2020-03-01'))
//   ) a
//   LEFT JOIN (
//     SELECT date(gmt_create) AS datetime, count(*) AS count
//     FROM t_order
//     WHERE DATE_FORMAT(t_order.gmt_create,'%Y-%m')='2020-03'
//     GROUP BY date(gmt_create)
//   ) b ON a.date = b.datetime
//   ORDER BY a.date;
}

