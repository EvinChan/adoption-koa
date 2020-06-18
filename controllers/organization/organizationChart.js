const {exec} = require('../../db/msyql')

// 首页dashboard
exports.getDashBoardData = async (db, id) => {
  if (db == 't_order') {
    db = 't_adoption,t_order'
  }
  let sql = `SELECT count(*) AS count 
             FROM t_user,t_organization,${db}
             WHERE t_user.user_id=${id}
             AND t_user.user_id=t_organization.user_id`
  if (db == 't_pet') {
    sql += ` AND t_organization.org_id=t_pet.org_id`
  } else if (db == 't_adoption') {
    sql += ` AND t_organization.org_id=t_adoption.adop_org`
  } else {
    sql += ` AND t_organization.org_id=t_adoption.adop_org
             AND t_adoption.adop_id=t_order.adop_id`
  }
  const rows = await exec(sql)
  return rows[0].count
  // t_pet
  // SELECT count(*) AS count
  // FROM t_user,t_organization,t_pet
  // WHERE t_user.user_id=5
  // and t_user.user_id=t_organization.user_id
  // and t_organization.org_id=t_pet.org_id
  // t_adoption
  // SELECT count(*) AS count
  // FROM t_user,t_organization,t_adoption
  // WHERE t_user.user_id=5
  // and t_user.user_id=t_organization.user_id
  // and t_organization.org_id=t_adoption.adop_org
  // t_order
  // SELECT count(*) AS count
  // FROM t_user,t_organization,t_adoption,t_order
  // WHERE t_user.user_id=5
  // and t_user.user_id=t_organization.user_id
  // and t_organization.org_id=t_adoption.adop_org
  // and t_adoption.adop_id=t_order.adop_id
}

// 首页dashboard No
exports.getDashBoardNoData = async (db, id) => {
  if (db == 't_order') {
    db = 't_adoption,t_order'
  }
  let sql = `SELECT count(*) AS count 
             FROM t_user,t_organization,${db}
             WHERE t_user.user_id=${id}
             AND t_user.user_id=t_organization.user_id`
  if (db == 't_adoption') {
    sql += ` AND t_organization.org_id=t_adoption.adop_org
             AND t_adoption.adop_status=0`
  } else {
    sql += ` AND t_organization.org_id=t_adoption.adop_org
             AND t_adoption.adop_id=t_order.adop_id
             AND t_order.order_status=1`
  }
  const rows = await exec(sql)
  return rows[0].count
  // t_adoption
  // SELECT count(*) AS count
  // FROM t_user,t_organization,t_adoption
  // WHERE t_user.user_id=5
  // AND t_user.user_id=t_organization.user_id
  // AND t_organization.org_id=t_adoption.adop_org
  // AND t_adoption.adop_status=0
  // t_order
  // SELECT count(*) AS count
  // FROM t_user,t_organization,t_adoption,t_order
  // WHERE t_user.user_id=5
  // AND t_user.user_id=t_organization.user_id
  // AND t_organization.org_id=t_adoption.adop_org
  // AND t_adoption.adop_id=t_order.adop_id
  // AND t_order.order_status=1
}

// 首页chart
exports.getDashBoardChart = async (db, id) => {
  let sql = `SELECT a.date,ifnull(b.count, 0) AS count
             FROM (
               SELECT date_sub(curdate(), INTERVAL 1 DAY) AS date UNION ALL
               SELECT date_sub(curdate(), INTERVAL 2 DAY) AS date UNION ALL
               SELECT date_sub(curdate(), INTERVAL 3 DAY) AS date UNION ALL
               SELECT date_sub(curdate(), INTERVAL 4 DAY) AS date UNION ALL
               SELECT date_sub(curdate(), INTERVAL 5 DAY) AS date UNION ALL
               SELECT date_sub(curdate(), INTERVAL 6 DAY) AS date UNION ALL
               SELECT date_sub(curdate(), INTERVAL 7 DAY) AS date
             ) a
             LEFT JOIN (`
  if (db == 't_pet') {
    sql += `SELECT date(t_pet.gmt_create) AS datetime, count(*) AS count
            FROM t_user,t_organization,t_pet
            WHERE t_user.user_id=${id}
            AND t_user.user_id=t_organization.user_id
            AND t_organization.org_id=t_pet.org_id
            GROUP BY date(t_pet.gmt_create)`
  } else {
    sql += `SELECT date(t_order.gmt_create) AS datetime, count(*) AS count
            FROM t_user,t_organization,t_adoption,t_order
            WHERE t_user.user_id=${id}
            AND t_user.user_id=t_organization.user_id
            AND t_organization.org_id=t_adoption.adop_org
            AND t_adoption.adop_id=t_order.adop_id
            GROUP BY date(t_order.gmt_create)`
  }
  sql += `) b ON a.date = b.datetime
          ORDER BY a.date;`
  return await exec(sql)
//   t_pet
//   SELECT a.date,ifnull(b.count, 0) AS count
//   FROM (
//     SELECT date_sub(curdate(), INTERVAL 1 DAY) AS date UNION ALL
//   SELECT date_sub(curdate(), INTERVAL 2 DAY) AS date UNION ALL
//   SELECT date_sub(curdate(), INTERVAL 3 DAY) AS date UNION ALL
//   SELECT date_sub(curdate(), INTERVAL 4 DAY) AS date UNION ALL
//   SELECT date_sub(curdate(), INTERVAL 5 DAY) AS date UNION ALL
//   SELECT date_sub(curdate(), INTERVAL 6 DAY) AS date UNION ALL
//   SELECT date_sub(curdate(), INTERVAL 7 DAY) AS date
//   ) a
//   LEFT JOIN (
//     SELECT date(t_pet.gmt_create) AS datetime, count(*) AS count
//     FROM t_user,t_organization,t_pet
//     WHERE t_user.user_id=5
//     and t_user.user_id=t_organization.user_id
//     and t_organization.org_id=t_pet.org_id
//     GROUP BY date(t_pet.gmt_create)
//   ) b ON a.date = b.datetime
//   ORDER BY a.date;
//   t_order
//   SELECT a.date,ifnull(b.count, 0) AS count
//   FROM (
//     SELECT date_sub(curdate(), INTERVAL 1 DAY) AS date UNION ALL
//     SELECT date_sub(curdate(), INTERVAL 2 DAY) AS date UNION ALL
//     SELECT date_sub(curdate(), INTERVAL 3 DAY) AS date UNION ALL
//     SELECT date_sub(curdate(), INTERVAL 4 DAY) AS date UNION ALL
//     SELECT date_sub(curdate(), INTERVAL 5 DAY) AS date UNION ALL
//     SELECT date_sub(curdate(), INTERVAL 6 DAY) AS date UNION ALL
//     SELECT date_sub(curdate(), INTERVAL 7 DAY) AS date
//   ) a
//   LEFT JOIN (
//     SELECT date(t_order.gmt_create) AS datetime, count(*) AS count
//     FROM t_user,t_organization,t_adoption,t_order
//     WHERE t_user.user_id=5
//     and t_user.user_id=t_organization.user_id
//     and t_organization.org_id=t_adoption.adop_org
//     and t_adoption.adop_id=t_order.adop_id
//     GROUP BY date(t_order.gmt_create)
//   ) b ON a.date = b.datetime
//   ORDER BY a.date;
}

// 数据报表 最近6个月的订单数
exports.getStatementChart1Data = async (id) => {
  let sql = `SELECT a.date,ifnull(b.count, 0) AS count
             FROM (
             SELECT DATE_FORMAT(CURDATE(), '%Y-%m') AS date UNION ALL
             SELECT DATE_FORMAT(CURDATE()-INTERVAL 1 MONTH, '%Y-%m') AS date UNION ALL
             SELECT DATE_FORMAT(CURDATE()-INTERVAL 2 MONTH, '%Y-%m') AS date UNION ALL
             SELECT DATE_FORMAT(CURDATE()-INTERVAL 3 MONTH, '%Y-%m') AS date UNION ALL
             SELECT DATE_FORMAT(CURDATE()-INTERVAL 4 MONTH, '%Y-%m') AS date UNION ALL
             SELECT DATE_FORMAT(CURDATE()-INTERVAL 5 MONTH, '%Y-%m') AS date
             ) a
             LEFT JOIN (
               SELECT DATE_FORMAT(t_order.gmt_create,'%Y-%m') AS datetime, count(*) AS count
               FROM t_user,t_organization,t_adoption,t_order
               WHERE t_user.user_id=${id}
               AND t_user.user_id=t_organization.user_id
               AND t_organization.org_id=t_adoption.adop_org
               AND t_adoption.adop_id=t_order.adop_id
               GROUP BY DATE_FORMAT(t_order.gmt_create,'%Y-%m')
             ) b ON a.date = b.datetime
             ORDER BY a.date;`
  return await exec(sql)
// SELECT a.date,ifnull(b.count, 0) AS count
// FROM (
//   SELECT DATE_FORMAT(CURDATE(), '%Y-%m') AS date UNION ALL
//   SELECT DATE_FORMAT(CURDATE()-INTERVAL 1 MONTH, '%Y-%m') AS date UNION ALL
//   SELECT DATE_FORMAT(CURDATE()-INTERVAL 2 MONTH, '%Y-%m') AS date UNION ALL
//   SELECT DATE_FORMAT(CURDATE()-INTERVAL 3 MONTH, '%Y-%m') AS date UNION ALL
//   SELECT DATE_FORMAT(CURDATE()-INTERVAL 4 MONTH, '%Y-%m') AS date UNION ALL
//   SELECT DATE_FORMAT(CURDATE()-INTERVAL 5 MONTH, '%Y-%m') AS date
// ) a
// LEFT JOIN (
//   SELECT DATE_FORMAT(t_order.gmt_create,'%Y-%m') AS datetime, count(*) AS count
//   FROM t_user,t_organization,t_adoption,t_order
//   WHERE t_user.user_id=5
//   AND t_user.user_id=t_organization.user_id
//   AND t_organization.org_id=t_adoption.adop_org
//   AND t_adoption.adop_id=t_order.adop_id
//   GROUP BY DATE_FORMAT(t_order.gmt_create,'%Y-%m')
// ) b ON a.date = b.datetime
// ORDER BY a.date;
}

// 数据报表 查询某月订单数量
exports.getStatementChart2Data = async (id, value1) => {
  let data1 = value1 + '-'
  let data2 = value1+ '-01'
  let sql = `SELECT a.date,ifnull(b.count, 0) AS count
             FROM (
               SELECT CONCAT('${data1}',date_table.stats_day) AS date
               FROM date_table
               WHERE date_table.stats_day <= DAYOFMONTH(LAST_DAY('${data2}'))
             ) a
             LEFT JOIN (
               SELECT date(t_order.gmt_create) AS datetime, count(*) AS count
               FROM t_user,t_organization,t_adoption,t_order
               WHERE t_user.user_id=${id}
               AND t_user.user_id=t_organization.user_id
               AND t_organization.org_id=t_adoption.adop_org
               AND t_adoption.adop_id=t_order.adop_id
               AND DATE_FORMAT(t_order.gmt_create,'%Y-%m')='${value1}'
               GROUP BY date(t_order.gmt_create)
             ) b ON a.date = b.datetime
             ORDER BY a.date;`
  return await exec(sql)
// SELECT a.date,ifnull(b.count, 0) AS count
// FROM (
//   SELECT CONCAT('2020-03-',date_table.stats_day) AS date
//   FROM date_table
//   WHERE date_table.stats_day <= DAYOFMONTH(LAST_DAY('2020-03-01'))
// ) a
// LEFT JOIN (
//   SELECT date(t_order.gmt_create) AS datetime, count(*) AS count
//   FROM t_user,t_organization,t_adoption,t_order
//   WHERE t_user.user_id=5
//   AND t_user.user_id=t_organization.user_id
//   AND t_organization.org_id=t_adoption.adop_org
//   AND t_adoption.adop_id=t_order.adop_id
//   AND DATE_FORMAT(t_order.gmt_create,'%Y-%m')='2020-03'
//   GROUP BY date(t_order.gmt_create)
// ) b ON a.date = b.datetime
// ORDER BY a.date;
}
