db.createUser({
    user: "andrea",
    pwd: "123456789",
    roles: [ { role: "readWrite", db: "experts" } ]
  })
