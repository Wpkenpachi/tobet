### To Do List

#### Bettor API

- [x] Create Project
- [x] Implement Graphql
- [x] Static Json Data to Test Graphql Queries
- [x] Create TypeDefs
- [x] Feed Some Bets
- [x] getUsers Query
- [x] getRounds Query
- [x] getMatches Query
- [x] getUserBets Query
- [ ] Implement Jest
- [ ] Implement Tests for Graphql Resolver Queries
- [ ] Implement MongoDb
- [ ] Create MongoDb Collections
- [ ] Change all static data by collection data
- [ ] Implement Mutations
- [ ] Implement Tests for Mutations

#### Admin API

### Running

- installing dependencies
  - `$ npm install`
- running project
  - `$ npm start`
- api url
  - https://localhost:4000/
- accessing playground
  - https://localhost:4000/graphql

### Queries

- Get Users

```
         query {
            getUsers {
                id
                name
                role
                email
            }
        }
```

- Get Rounds

```
query {
  getRounds {
    id
    status
    matches {
      id
      home
      date
    	guest
      score {
        home
        guest
      }
      result
      status
      start_time
    }
    bets_on
    locality
    end_date
    start_date
    max_betted_value
    bet_values {
      draw
      score
      home_win
      guest_win
    }
    max_bets_value
    max_bets_rescue
  }
}

```

- Get Matches

```
query {
  getMatches(roundId: "0740098c-aaf9-47f8-84d8-cbcccaffaf54") {
    id
    home
    date
    guest
    score {
      home
      guest
    }
    result
    status
    start_time
  }
}
```

- Get User Bets

```
query {
  getUserBets(bettorId: "f365351e-d949-4a61-ae73-1a3ba06929b1") {
  	id
    bet
    status
    result
    bet_code
    match {
      id
      home
      guest
      date
      score {
        home
        guest
      }
      start_time
      status
      result
    }
  }
}
```
