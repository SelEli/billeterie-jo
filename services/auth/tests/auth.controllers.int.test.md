 PASS  tests/auth.controllers.int.test.js
  Auth Controllers Integration
    loginController
      √ returns 400 if missing credentials (6 ms)
      √ returns 200 if success (1 ms)
      √ returns 401 if service returns INVALID_PASSWORD (1 ms)
      √ returns 500 if service throws (2 ms)
    registerUserController
      √ returns 400 if missing fields (2 ms)
      √ returns 201 if success (1 ms)
      √ returns 409 if service returns EMAIL_ALREADY_USED (2 ms)
    getProfileController
      √ returns 400 if invalid id
      √ returns 200 if success (1 ms)
      √ returns 404 if service returns null
    updateProfileController
      √ returns 400 if invalid id (1 ms)
      √ returns 200 if success
      √ returns 404 if service returns null
    deleteProfileController
      √ returns 400 if invalid id
      √ returns 204 if success (1 ms)
      √ returns 404 if service returns null (1 ms)
    logoutController
      √ returns 401 if no user
      √ returns 200 if success
      √ returns 500 if service throws (1 ms)

-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------|---------|----------|---------|---------|-------------------
All files                |   67.04 |    60.43 |   32.75 |   68.35 |                   
 controllers/auth        |   85.71 |    75.86 |     100 |   85.71 |                   
  ...ofile.controller.js |   94.73 |     87.5 |     100 |   94.73 | 19                
  ...ofile.controller.js |   84.21 |     87.5 |     100 |   84.21 | 21,32-33          
  index.js               |   84.61 |       50 |     100 |   84.61 | 19-20             
  login.controller.js    |   94.73 |       80 |     100 |   94.73 | 26                
  logout.controller.js   |     100 |      100 |     100 |     100 |                   
  ...rUser.controller.js |   68.96 |       60 |     100 |   68.96 | ...48,54-55,65-67 
  ...ofile.controller.js |   84.21 |     87.5 |     100 |   84.21 | 19,28-29          
 utils                   |   47.65 |    33.33 |   23.52 |   49.59 |                   
  httpErrorMap.js        |      80 |       50 |     100 |      80 | 56                
  httpSuccessMap.js      |   29.72 |       50 |   21.87 |   29.72 | ...27-33,37-41,46 
  index.js               |     100 |      100 |     100 |     100 |                   
  jwt.js                 |   33.33 |      100 |       0 |   33.33 | 4-11              
  kafkaClient.js         |      15 |        0 |       0 |   15.78 | 12-51             
  keys.js                |   33.33 |        0 |       0 |   33.33 | 9-34              
  logger.js              |      50 |    28.57 |       0 |   57.14 | 16-18             
  prismaClient.js        |   85.71 |       50 |     100 |   85.71 | 8                 
  redisClient.js         |   27.27 |        0 |       0 |    37.5 | 8-15              
  requestId.js           |      50 |      100 |       0 |      50 | 4-5               
  response.ts            |     100 |    66.66 |     100 |     100 | 2                 
  sendError.js           |     100 |      100 |     100 |     100 |                   
  sendSuccess.js         |     100 |      100 |     100 |     100 |                   
-------------------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        3.737 s
Ran all test suites matching /tests\\auth.controllers.int.test.js/i.