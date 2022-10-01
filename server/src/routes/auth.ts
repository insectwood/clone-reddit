import {Router, Request, Response} from "express";
import {User} from "../entities/User";
import {validate} from "class-validator";

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

const router = Router();
router.post("/register", register);

export default router;