const express = require('express')
require('dotenv').config()

const port = process.env.PORT || 5000

app.listen(port, () => {
    db.sync({  })
      .then(() => console.log(`app is running on port ${port}`))
      .catch(err => console.log(err.message))
  })