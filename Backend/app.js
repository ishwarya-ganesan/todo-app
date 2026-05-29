//import
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const app = express();
// const portNo = 3005;
const portNo = process.env.PORT || 3005;
// let todoApp = [];


//-----------------------------CREATING DATABASE------------------------//

// mongoose.connect("mongodb://127.0.0.1:27017/todoDB")
mongoose.connect(process.env.MONGO_URL)

    .then(() => {
        console.log("MongoDB Connected Successfully");
    })//->promise
    .catch((err) => {
        console.log(err);
    })

//-----------------------------CREATING SCHEMA->STRUCTURE------------------//

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        

    },
    description: String,
    userId : String,
});


//-----------------------------CREATING COLLECTION->TABLE------------------//

const todoModel = mongoose.model("todoApp", todoSchema);

// app.use(cors());
app.use(cors({
    origin : "https://6a192c21705505ef7fbdf3c9--mytodo-app-tracker.netlify.app/"
}));

//-----------------------------MIDDLEWARE------------------------------------//

app.use(express.json());

const verifyToken = (req, res, next) => {
    const tokenHeader = (req.headers.authorization);
    if (!tokenHeader) {
        res.json({ message: "No token found" });
    }
    const token = tokenHeader.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.json({ message: "Invalid token" });
    }
}

//-----------------------------------------------------------------------------//
//                                   API CALL                                  
// ---------------------------------------------------------------------------//



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    }
})

const userModel = mongoose.model("User", userSchema);


//login api

app.post("/signIn", async (req, res) => {
    try {
        let userLogin = req.body;
        console.log(req.body);
        
        let loginDetails = await userModel.findOne({ email: userLogin.email });
        if (loginDetails != null) {
            //check password
            let result = await bcrypt.compare(userLogin.password, loginDetails.password);
            if (result == true) {
                const token = jwt.sign({ id: loginDetails._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
                res.json({ token });
            }
            else {
                res.json({ message: "password doesn't match" });
            }
        } else {
            res.json({ message: "Invalid Credentials" });
        }
    }
    catch (error) {
        res.json({ message: error });
    }
})


//sign up api

app.post("/signUp", async (req, res) => {
    try {
        let newUser = new userModel(req.body);
        console.log(req.body);
        let oldUser = await userModel.findOne({ email: newUser.email })
        if (oldUser == null) {
            hashedPassword = await bcrypt.hash(newUser.password, 10);
            newUser.password = hashedPassword;
            await newUser.save();
            res.json(newUser);
            console.log(newUser);
        } else {
            res.json({ message: "EmailId already exist" });
        }
    }
    catch (error) {
        res.json({ message: error });
    }
})

//forgot password

app.post("/forgotPassword", async (req, res) => {
    //enter email
    let userEmail = req.body.email;
    //check email
    let user = await userModel.findOne({ email: userEmail });
    if (!user) {
        res.json("User does not exist");
    } else {
        //reset token
        const token = generateToken(user._id);
        res.json(token);
    }
})

//sign out




//-------------------add list-------------------------//
app.post("/addList", verifyToken, async (req, res) => {
  
    const { title, description } = req.body;
    try {
        const newRow = new todoModel({ title, description });
        console.log(req.user.id);
        newRow.userId = req.user.id;
        await newRow.save();
        res.status(201).json(newRow);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

})
//-------------------get list-------------------------//
app.get("/getList", verifyToken, async (req, res) => {
    // res.json(todoApp);
    try {
        let todoList = await todoModel.find({userId : req.user.id});
        res.status(200).json(todoList);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})
//-------------------get list by id-------------------------//
app.get("/:getListById", async (req, res) => {
    try {
        let list = await todoModel.findById(req.params.getListById);
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
//-------------------update list 2ways-------------------------//

app.put("/updateList/:todoListId", async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.todoListId;

        let todoList = await todoModel.findByIdAndUpdate(id, { title, description }, { new: true });
        if (!todoList) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(201).json(todoList);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});



//-------------------delete list 2ways-------------------------//

app.delete("/deleteList/:abc", async (req, res) => {
    try {
        const id = req.params.abc;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})


//-----------------------------CREATING SERVER------------------//

app.listen(portNo, () => {
    console.log(`server is listening on ${portNo} port...`);
});

