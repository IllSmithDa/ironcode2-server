
const bcrypt = require('bcrypt');
const { User } = require('../models/Users');

//https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
const saltRounds = 10;
const checkPasswordValid = (password) => {
  const regex =  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/;
  return regex.test(password);
}

const checkUsernameVali = (username) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9]{5,20}$/;
  return regex.test(username);
}

const encryptUserData = async (password) => {
  try { 
    const passwordSalt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, passwordSalt);
    return {
      hashedPassword,
    }
  } catch (err) {
    return {
      err: 'Encryption has failed. Contact administrator for help'
    }
  }
}
const comparePasswords = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}
/*
const simpleEmailCheck = async (email) => {
  let res = await validate(email);
  return (res.valid);
}

const checkEmailRapid = async (email) => {

  const options = {
    method: 'GET',
    url: 'https://validect-email-verification-v1.p.rapidapi.com/v1/verify',
    params: {
      email,
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host':process.env.RAPID_API_HOST
    }
  };
  try {
    const response = await axios.request(options);
    console.log(response.data.status === 'valid');
    return response.data.status === 'valid';
  } catch (error) {
    return await simpleEmailCheck(email);
  }
}
*/
const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    //password test 
    // console.log('hello')
    const passwordRes = checkPasswordValid(password);
    if (passwordRes === false) {
      res.status(401).json({ success: false, err: 
        'Password is not valid. Password must have a minimum of 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number and in total be at least 8 characters long and maximum of 24 characters long'})
      res.end();
      return;
    }
    const userValid = checkUsernameVali(username);
    if (userValid === false) {
      res.status(401).json({ success: false, err: 
        'Username is not valid. Username must start with a lower or uppercase letter, cannot contain any special characters and must a minumum of 5 characters and a maximum of 20 characters long. Username can include numbers as long as it is not the first character of the username. '})
      res.end();
      return;
    }

    const userResult = await User.findUserbyUsername(username);
    if (userResult?.success) { 
      res.status(401).json({
        err: 'Username already is taken. Try another username'
      })
      res.end();
      return;
    }
    /*
    const emailRes = await checkEmailRapid(email);
    if (emailRes === false) {
      res.status(401).json({ success: false, err: 'Email is not valid'})
      res.end();
      return;
    }
    */
    const result = await encryptUserData(password);
    // console.log(result);
    const { hashedPassword } = result;

    await User.createUser(email, username, hashedPassword)

    res.status(200).json({ 
      username,
      email
    })
    res.end();
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err.message })
  }
}
const changePassword = async (req, res ) => {
  const { password, newPassword, username } = req.body;

  try {
    // console.log(result);
    const user = await User.getUserPassword(username);
    if (!user.success) {
      // req.session.destroy();
      res.status(401).json({ err: 'email and/or password is incorrect' });
      res.end();
      return;
    }
    // console.log(user.data.password)
    const oldHashedPW =  user.data.password;
    const match = await comparePasswords(password, oldHashedPW);
  
    // console.log(`is match: ${match}`)
  
    if(!match) {
      // req.session.destroy();
      res.status(401).json({ err: 'email and/or password is incorrect' });
      res.end();
      return;
    }

    const passwordRes = checkPasswordValid(newPassword);
    if (passwordRes === false) {
      res.status(401).json({ success: false, err: 
        'Password is not valid. Password must have a minimum of 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number and in total be at least 8 characters long and maximum of 24 characters long'})
      res.end();
      return;
    }
    // console.log(password)
    const result = await encryptUserData(newPassword);
    const { hashedPassword } = result;
    // console.log(hashedPassword);
    const finalRes = await User.changePassword(hashedPassword, username);
    if (finalRes.success) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Could not fetch data from the database' })
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message })
  }
}

//https://stackoverflow.com/questions/26531143/sessions-wont-save-in-node-js-without-req-session-save
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  const user = await User.findUserbyEmail(email);
  if (!user.success) {
    // req.session.destroy();
    res.status(401).json({ err: 'email and/or password is incorrect' });
    res.end();
    return;
  }
  if (user.data.isbanned) {
    res.status(403).json({ err: 'User is currently banned. Please contact support for addtional help.' });
    res.end();
    return;
  }
  // console.log(user.data.password)
  const hashedPassword =  user.data.password;
  const match = await comparePasswords(password, hashedPassword);

  console.log(`is match: ${match}`)

  if(!match) {
    // req.session.destroy();
    res.status(401).json({ err: 'email and/or password is incorrect' });
    res.end();
    return;
  }
  // next();
  // console.log(user.data.username);
  req.session.user = user.data.username;
  console.log("test: " + req.session.user);
  // req.session.save((err) => console.log(err));
  res.status(200).send({
    id: user.data.id,
    username: user.data.username,
    email: user.data.email,
    isAdmin: user.data.isAdmin,
    created_at: user.data.created_at,
    strikes: user.data.strikes,
    isbanned: user.data.isBanned
  });
  res.end();
}

/*
  id BIGSERIAL PRIMARY KEY, 
  username VARCHAR ( 255 ) UNIQUE NOT NULL,
  password VARCHAR ( 255 ) NOT NULL,
  email VARCHAR ( 255 ) UNIQUE NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  isAdmin BOOLEAN DEFAULT FALSE,
  imageUrl VARCHAR (1000),
  strikes INTEGER DEFAULT 0,
  isbanned BOOLEAN DEFAULT FALSE
*/

const getUserByUsername =async (req, res) => {
  const { user } = req.body;
  try {
    const userRes = await User.findUserbyUsername(user);
    res.status(200).json({ userData: userRes })
  } catch(err) {
    res.status(403).json({ err })
  }
}
const getUserSession = async (req, res) => {
  const {user} = req.session;
  try {
    // console.log(user);
    const userRes = await User.findUserbyUsername(user);
    if (userRes.data.isbanned) {
      res.status(403).json({ err: 'User is currently banned. Please contact support for addtional help.' });
      res.end();
      return;
    }
    // console.log(userRes.data)
    res.status(200).json({
      id: userRes.data.id,
      username: userRes.data.username,
      email: userRes.data.email,
      isAdmin: userRes.data.isadmin,
      created_at: userRes.data.created_at,
      strikes: userRes.data.strikes,
      isBanned: userRes.data.isbanned
    })
  } catch(err) {
    res.status(403).json({ err })
  }
}
const getUsers =async (req, res) => {
  const data = await User.getUsers();
  res.status(200).json({ user: data})
}
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const data = await User.findUserbyEmail(email);
    res.status(200).json({ user: data})
  } catch(err) {
    res.status(403).json({ err, success: false })
  }

}
const logoutUser = async (req, res) => {
  req.session.destroy();
  res.status(200).json({ success: true });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserByUsername,
  getUsers,
  getUserByEmail,
  getUserSession,
  changePassword
}