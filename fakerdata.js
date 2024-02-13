const { faker } = require("@faker-js/faker");

module.exports = function () {
  return {
    todos: faker.helpers.multiple(
      () => {
        return {
          username: faker.internet.userName(),
          todos: faker.helpers.multiple(
            () => {
              return {
                name: faker.lorem.word(),
                status: faker.number.binary(),
              };
            },
            {
              count: 2,
            },
          ),
        };
      },
      {
        count: 5,
      },
    ),
  };
};
