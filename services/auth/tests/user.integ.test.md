 PASS  tests/user.integ.test.js
  ✅ User Integration Tests
    √ POST /user → 201 Created (204 ms)
    √ POST /user → 400 Email already used (10 ms)
    √ GET /user → 200 OK (7 ms)
    √ GET /user/:id → 200 OK (8 ms)
    √ PUT /user/:id → 200 OK (9 ms)
    √ DELETE /user/:id → 204 No Content (8 ms)
    √ POST /user sans token → 401 Unauthorized (9 ms)

-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------|---------|----------|---------|---------|-------------------
All files                |   49.57 |       23 |   32.35 |   54.83 |               
 auth                    |    67.5 |    16.66 |      60 |   70.27 |                   
  app.js                 |    67.5 |    16.66 |      60 |   70.27 | 31-33,59-60,65-71 
 auth/controllers        |   35.89 |    16.16 |   34.28 |   42.85 |                   
  auth.controller.js     |   14.81 |        0 |       0 |   18.18 | 16-75             
  core.controller.js     |   47.05 |    18.75 |   66.66 |   53.33 | ...52,55-56,69-74 
  role.controller.js     |    12.5 |        0 |       0 |   14.81 | 14-74             
  user.controller.js     |      75 |       65 |     100 |   94.73 | 38                
 auth/middlewares        |   80.85 |     61.9 |     100 |   82.22 |                   
  auth.middleware.js     |   78.26 |    66.66 |     100 |   81.81 | 16,20,28,34       
  index.js               |   77.77 |       50 |     100 |   77.77 | 11-12             
  ...quest.middleware.js |   86.66 |    57.14 |     100 |   85.71 | 12,29             
 auth/routes             |   80.35 |    66.66 |   46.66 |   82.07 |
  auth.routes.js         |      80 |       50 |   33.33 |    82.6 | 37-38,45-46
  health.js              |      60 |       50 |       0 |      60 | 7-8,16-17,23-24
  index.js               |    87.5 |       80 |      75 |    87.5 | 23-26
  role.routes.js         |   79.16 |       50 |   33.33 |   81.81 | 34-35,42-43
  user.routes.js         |    87.5 |       50 |   66.66 |    90.9 | 36-37
 auth/schemas            |   73.01 |    28.57 |   30.76 |   76.66 |
  auth.schema.js         |      75 |       25 |   33.33 |      80 | 25-26,34
  core.schema.js         |     100 |      100 |     100 |     100 |
  role.schema.js         |      65 |       10 |   33.33 |   68.42 | 10-13,33-36
  user.schema.js         |   72.72 |    57.14 |   28.57 |   76.19 | 17,41-44,53-56
 auth/services           |   21.87 |    12.72 |   16.66 |   26.97 |
  auth.service.js        |   11.11 |        0 |       0 |    13.2 | 14-102,111-139
  role.service.js        |     3.7 |        0 |       0 |    4.91 | 8-162
  user.service.js        |   66.66 |    48.27 |     100 |   81.57 | 34-36,52,65-67
 auth/utils              |   48.03 |     30.3 |   21.56 |      50 |
  httpErrorMap.js        |      40 |        0 |       0 |      40 | 55-58
  httpSuccessMap.js      |   27.02 |       50 |   18.75 |   27.02 | ...26-36,38-41,46
  index.js               |     100 |      100 |     100 |     100 |
  jwt.js                 |   33.33 |      100 |       0 |   33.33 | 4-11
  kafkaClient.js         |      15 |        0 |       0 |   15.78 | 12-51
  keys.js                |   33.33 |        0 |       0 |   33.33 | 9-34
  logger.js              |    87.5 |    57.14 |     100 |     100 | 7-17
  prismaClient.js        |   85.71 |       50 |     100 |   85.71 | 8
  redisClient.js         |   27.27 |        0 |       0 |    37.5 | 8-15
  requestId.js           |     100 |      100 |     100 |     100 |
  response.js            |     100 |    33.33 |     100 |     100 | 1-13
  sendError.js           |      75 |      100 |       0 |      75 | 6
  sendSuccess.js         |     100 |    66.66 |     100 |     100 | 5
-------------------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        2.61 s
Ran all test suites matching /tests\\user.integ.test.js/i.