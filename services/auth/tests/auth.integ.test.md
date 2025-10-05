 PASS  tests/auth.int.test.js
  ✅ Auth Integration Tests
    √ POST /auth/register → 201 Created (205 ms)
    √ POST /auth/login → 400 Wrong password (11 ms)
    √ POST /auth/login → 400 Missing credentials (9 ms)
    √ GET /auth/profile → 200 OK (96 ms)
    √ PUT /auth/profile → 200 OK (90 ms)
    √ DELETE /auth/profile → 204 No Content (93 ms)
    √ POST /auth/logout → 200 OK (99 ms)
    √ GET /auth/profile sans token → 401 Unauthorized (8 ms)

-------------------------|---------|----------|---------|---------|-------------------File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------|---------|----------|---------|---------|-------------------All files                |   53.52 |    28.16 |   38.75 |   59.02 |                   
 auth                    |    67.5 |    16.66 |      60 |   70.27 |                   
  app.js                 |    67.5 |    16.66 |      60 |   70.27 | 31-33,59-60,65-71 
 auth/controllers        |   39.31 |    24.24 |   42.85 |   45.91 |                   
  auth.controller.js     |   81.48 |    72.41 |     100 |   95.45 | 18                
  core.controller.js     |   47.05 |    18.75 |   66.66 |   53.33 | ...52,55-56,69-74 
  role.controller.js     |    12.5 |        0 |       0 |   14.81 | 14-74             
  user.controller.js     |   16.66 |        0 |       0 |   21.05 | 14-64             
 auth/middlewares        |   80.85 |     61.9 |     100 |   82.22 |                   
  auth.middleware.js     |   78.26 |    66.66 |     100 |   81.81 | 16,20,28,34       
  index.js               |   77.77 |       50 |     100 |   77.77 | 11-12             
  ...quest.middleware.js |   86.66 |    57.14 |     100 |   85.71 | 12,29             
 auth/routes             |   80.35 |    66.66 |   46.66 |   82.07 |                   
  auth.routes.js         |      88 |       50 |   66.66 |    91.3 | 37-38             
  health.js              |      60 |       50 |       0 |      60 | 7-8,16-17,23-24   
  index.js               |    87.5 |       80 |      75 |    87.5 | 23-26             
  role.routes.js         |   79.16 |       50 |   33.33 |   81.81 | 34-35,42-43       
  user.routes.js         |   79.16 |       50 |   33.33 |   81.81 | 36-37,44-45       
 auth/schemas            |   73.01 |     23.8 |   30.76 |   76.66 |                   
  auth.schema.js         |    87.5 |       75 |   66.66 |   93.33 | 34                
  core.schema.js         |     100 |      100 |     100 |     100 |                   
  role.schema.js         |      65 |       10 |   33.33 |   68.42 | 10-13,33-36       
  user.schema.js         |   63.63 |    14.28 |   14.28 |   66.66 | 14-17,40-43,52-55 
 auth/services           |   28.12 |    19.09 |   33.33 |   34.86 |                   
  auth.service.js        |   71.42 |    63.63 |     100 |   83.01 | ...,58,98,137-139 
  role.service.js        |     3.7 |        0 |       0 |    4.91 | 8-162             
  user.service.js        |    12.5 |        0 |       0 |   15.78 | 10-41,49-72       
 auth/utils              |   58.33 |    43.47 |   27.27 |   58.94 |                   
  httpErrorMap.js        |      40 |        0 |       0 |      40 | 55-58             
  httpSuccessMap.js      |   29.72 |       50 |   21.87 |   29.72 | ...27-33,37-41,46 
  index.js               |     100 |      100 |     100 |     100 |                   
  jwt.js                 |   33.33 |      100 |       0 |   33.33 | 4-11              
  keys.js                |   33.33 |        0 |       0 |   33.33 | 9-34              
  logger.js              |    87.5 |    57.14 |     100 |     100 | 7-17              
  prismaClient.js        |   85.71 |       50 |     100 |   85.71 | 8                 
  requestId.js           |     100 |      100 |     100 |     100 |                   
  response.js            |     100 |    33.33 |     100 |     100 | 1-13              
  sendError.js           |      75 |      100 |       0 |      75 | 6                 
  sendSuccess.js         |     100 |    66.66 |     100 |     100 | 5                 
-------------------------|---------|----------|---------|---------|-------------------Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        2.854 s, estimated 3 s
Ran all test suites matching /tests\\auth.int/i.