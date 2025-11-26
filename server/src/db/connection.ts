import knex, { Knex } from "knex";

export const connection: Knex = knex({
  client: "better-sqlite3",
  connection: {
    filename: "./data/db.sqlite3",
  },
  useNullAsDefault: true,
});
