import {Router, Request, Response} from "express";
import {User} from "../entities/User";
import {isEmpty, validate} from "class-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const mapErrors = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
        prev[err.property] = Object.entries(err.constraints)[0][1];
        return prev;
    }, {});
};

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    try {
        let errors: any = {};

        // Check if Email and Username are already saved and used
        const emailUser = await User.findOneBy({email});
        const usernameUser = await User.findOneBy({username});

        // If they already exist, put it in the errors object.
        if(emailUser) errors.email = "Email address already in use"
        if(usernameUser) errors.username = "Username already in use"

        // If there is an error, the error is returned as a response
        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        const user = new User();
        user.email = email;
        user.username = username;
        user.password = password;

        // validation
        errors = await validate(user);
        if(errors.length > 0) {
            return res.status(400).json(mapErrors(errors));
        }

        // save in user table
        await user.save();
        return res.json(user);
    } catch (e) {
        console.error(e);
        return res.status(500).json({e});
    }
}

const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    try {
        let errors: any = {}

        if(isEmpty(username)) {
            errors.username = "사용자이름은 공백x"
        }
        if(isEmpty(password)) {
            errors.username = "사용자이름은 공백x"
        }
        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }
        const user = await User.findOneBy({username});
        if(!user) {
            return res.status(404).json({username: "사용자 이름이 등록되지안았습니다"})
        }
        const passwordMatches = await bcrypt.compare(password, user.password);

        if(!passwordMatches) {
            return res.status(401).json({username: "비밀번호가 잘못됬습니다"})
        }
        const token = jwt.sign({username}, process.env.JWT_SECRET)
        res.set("Set-Cookie", cookie.serialize("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/"
        }));
        return res.json({user, token});
    } catch (e) {
        console.error(e)
        return res.status(500).json(e);
    }
}

const router = Router();
router.post("/register", register);
router.post("login", login);

export default router;