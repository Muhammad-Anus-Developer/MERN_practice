const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const { mongoose } = require('mongoose');

const port = process.env.PORT || 4000;

app.use(express.json())

const DB = "mongodb+srv://anusafzalalisonsinput:anusafzalalisonsinput@cluster0.4kkxq.mongodb.net/input_data?retryWrites=true&w=majority";
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log("Connection Successful");
}).catch((err)=>{
  console.log("No Connection", err);
})




const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send("User Created Successfully")
  } catch {
    res.status(500).send("Some Error Occured!")
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Logged In Successfully!')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(port, ()=>{
    console.log(`Server running on ${port}`);
})