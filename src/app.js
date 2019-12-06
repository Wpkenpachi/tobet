const { ApolloServer, gql } = require("apollo-server");
const uuidv4 = require("uuid/v4");
const shortid = require("shortid");

const fakeBets = () => {
  const rounds = require("../src/database/static/rounds.json");
  const foundRound = rounds.find(
    round => round.id === "0740098c-aaf9-47f8-84d8-cbcccaffaf54"
  );

  const users = require("../src/database/static/users.json");
  const bettor = users.find(user => user.role === "BETTOR");

  const matches = foundRound.matches;
  let bets = [];
  matches.forEach(({ id }) => {
    const my_bet_value = Math.floor(Math.random() * foundRound.max_bets_value);
    // status be enum CREATED | AUTHENTICATED | OVERDUE
    // result WIN | PARCIAL_WIN | LOSE
    bets.push({
      id: uuidv4(),
      user_id: bettor.id,
      round_id: foundRound.id,
      match_id: id,
      bet_code: shortid.generate(),
      bet: my_bet_value,
      status: "CREATED",
      result: null
    });
  });
  return bets;
};

const bets = fakeBets();

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRoleEnum!
  }

  enum UserRoleEnum {
    ADMIN
    GAMBLER
  }

  type Team {
    id: ID!
    name: String!
  }

  type Round {
    id: ID!
    name: String!
    locality: String!
    start_date: String!
    end_date: String!
    matches: [RoundMatch!]!
    max_betted_value: Int
    max_bets_value: Int!
    max_bets_rescue: Int!
    bet_values: RoundBetValue!
    bets_on: Boolean!
    status: RoundStatusEnum!
  }

  type RoundMatch {
    id: ID!
    home: ID!
    guest: ID!
    result: MatchResultEnum
    score: RoundMatchScore!
    date: String!
    start_time: String!
    status: RoundMatchStatusEnum!
  }

  type RoundMatchScore {
    home: Int
    guest: Int
  }

  enum RoundMatchStatusEnum {
    CLOSED
    OPEN
    RUNNING
  }

  enum MatchResultEnum {
    HOME_WIN
    GUEST_WIN
    DRAW
  }

  type RoundBetValue {
    home_win: Int!
    guest_win: Int!
    draw: Int!
    score: Int!
  }

  enum RoundStatusEnum {
    CLOSED
    OPEN
  }

  type Bet {
    id: ID!
    bet_code: ID!
    user_id: ID!
    round_id: ID!
    match_id: ID!
    bet: Int!
    status: BetStatusEnum!
    result: BetResultEnum
  }

  enum BetResultEnum {
    WIN
    PARCIAL_WIN
    LOSE
  }

  enum BetStatusEnum {
    CREATED
    AUTHENTICATED
    OVERDUE
  }

  type Query {
    getUsers: [User!]!
    getRounds: [Round!]!
    getMatches(roundId: ID!): [RoundMatch!]!
    getRoundsHistory(maxResult: Int = 5, order: orderInput = DESC): [Round!]!
    getUserBets(bettorId: ID!): [getUserBetReturn!]!
  }

  type getUserBetReturn {
    id: ID!
    bet_code: ID!
    user_id: ID!
    match: RoundMatch!
    bet: Int!
    status: BetStatusEnum!
    result: BetResultEnum
  }

  enum orderInput {
    DESC
    ASC
  }
`;

const resolvers = {
  Query: {
    getUsers: () => require("../src/database/static/users.json") || [],
    getRounds: () => require("../src/database/static/rounds.json") || [],
    getMatches: (parent, args, context, info) => {
      const roundId = args.roundId;
      const rounds = require("../src/database/static/rounds.json");
      const foundRound = rounds.find(round => round.id === roundId);
      return foundRound.matches;
    },
    getUserBets: (parent, args, context, info) => {
      const betList = bets.filter(bet => bet.user_id === args.bettorId) || [];
      const rounds = require("../src/database/static/rounds.json");
      return betList.map(
        ({ id, bet_code, round_id, match_id, bet, status, result }) => {
          const foundRound = rounds.find(
            ({ id: roundId }) => roundId === round_id
          );
          return {
            id,
            bet_code,
            match: foundRound.matches.find(match => match.id === match_id),
            bet,
            status,
            result
          };
        }
      );
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Ready in ${url}`);
  console.log(`GraphQL Playground in ${url}/graphql`);
});
