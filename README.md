###基于Node.js的宠物领养系统的设计与开发
####1.系统简介
本系统是一个基于Node.js的宠物领养系统，分为前台门户模块、宠物机构模块、系统管理员模块。
前台门户模块包括注册登录、个人资料管理、宠物搜索、宠物领养、订单管理、机构申请等功能，地址为https://github.com/Rita-hyq/adoption-front-user
宠物机构模块包括机构资料管理、宠物信息管理、领养审核、订单管理、查看数据报表等功能，地址为https://github.com/Rita-hyq/adoption-front-organization
系统管理员模块包括用户管理、宠物机构管理、宠物管理、订单管理、首页管理、系统公告管理、查看数据报表等功能，地址为https://github.com/Rita-hyq/adoption-front-admin
####2.后端技术选型
运行环境：Node.js
Web框架：Koa2
数据库：MySQL 8.0、Redis 3.2
身份认证框架：jsonwebtoken 8.5.1
####3.前端技术选型
核心框架：Vue.js 2.6.10
路由框架：vue-router 3.1.3
状态管理框架：Vuex 3.0.1
UI框架：Element-ui 2.13.0
HTTP请求框架：Axios 0.19.0
富文本编辑器：Tinymce 4.7.5
####4.运行截图
前台门户模块
![2e7d8012ad3df20b250512cea61b5dac.png](README_files/2e7d8012ad3df20b250512cea61b5dac.png)
![f332bfb11c46d9f765c906022a3c9f47.png](README_files/f332bfb11c46d9f765c906022a3c9f47.png)
![500c54fa31594e1a03dc035bfde7e88b.png](README_files/500c54fa31594e1a03dc035bfde7e88b.png)
![76306f302e9657d4699de9f81db6d7fd.png](README_files/76306f302e9657d4699de9f81db6d7fd.png)
![1652953.png](README_files/1652953.png)
![1691203.png](README_files/1691203.png)
![%E7%94%B3%E8%AF%B7%E9%A2%86%E5%85%BB.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E7%94%B3%E8%AF%B7%E9%A2%86%E5%85%BB.png)
![%E7%94%B3%E8%AF%B7%E4%B8%BA%E6%9C%BA%E6%9E%84.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E7%94%B3%E8%AF%B7%E4%B8%BA%E6%9C%BA%E6%9E%84.png)
宠物机构模块
![%E9%A6%96%E9%A1%B5_3.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E9%A6%96%E9%A1%B5_3.png)
![%E5%AE%A0%E7%89%A9%E4%BF%A1%E6%81%AF%E5%88%97%E8%A1%A8.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E5%AE%A0%E7%89%A9%E4%BF%A1%E6%81%AF%E5%88%97%E8%A1%A8.png)
![%E9%A2%86%E5%85%BB%E7%94%B3%E8%AF%B7%E5%88%97%E8%A1%A8.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E9%A2%86%E5%85%BB%E7%94%B3%E8%AF%B7%E5%88%97%E8%A1%A8.png)
![%E8%AE%A2%E5%8D%95%E5%88%97%E8%A1%A8.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E8%AE%A2%E5%8D%95%E5%88%97%E8%A1%A8.png)
![%E6%8A%A5%E8%A1%A8%E6%9F%A5%E7%9C%8B.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E6%8A%A5%E8%A1%A8%E6%9F%A5%E7%9C%8B.png)
系统管理员模块
![%E9%A6%96%E9%A1%B5_4.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E9%A6%96%E9%A1%B5_4.png)
![%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF%E5%88%97%E8%A1%A8.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF%E5%88%97%E8%A1%A8.png)
![%E6%9C%BA%E6%9E%84%E5%88%97%E8%A1%A8.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E6%9C%BA%E6%9E%84%E5%88%97%E8%A1%A8.png)
![%E5%AE%A0%E7%89%A9%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E5%AE%A0%E7%89%A9%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86.png)
![%E8%AE%A2%E5%8D%95%E5%88%97%E8%A1%A8_2.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E8%AE%A2%E5%8D%95%E5%88%97%E8%A1%A8_2.png)
![%E8%BD%AE%E6%92%AD%E5%9B%BE%E5%88%97%E8%A1%A8.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E8%BD%AE%E6%92%AD%E5%9B%BE%E5%88%97%E8%A1%A8.png)
![%E5%85%AC%E5%91%8A%E5%88%97%E8%A1%A8.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E5%85%AC%E5%91%8A%E5%88%97%E8%A1%A8.png)
![%E6%8A%A5%E8%A1%A8%E6%9F%A5%E7%9C%8B_2.png](file:///E:/%E4%B8%BA%E7%9F%A5%E7%AC%94%E8%AE%B0/temp/d283209b-2c1e-40ba-917c-1468020e9d35/128/index_files/%E6%8A%A5%E8%A1%A8%E6%9F%A5%E7%9C%8B_2.png)
