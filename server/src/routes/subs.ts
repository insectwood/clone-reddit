import {Request, Response, Router} from "express";
import jwt from "jsonwebtoken";
import {User} from "../entities/User";
import userMiddleware from "../middlewares/user"
import authMiddleware from "../middlewares/auth"
import {isEmpty} from "class-validator";
import {AppDataSource} from "../data-source";
import Sub from "../entities/Sub";

const createSub = async (req: Request, res: Response, next) => {
    const {name, title, description} = req.body;

    try {
        let errors: any = {};
        if (isEmpty(name)) errors.name = "name not empty"
        if (isEmpty(title)) errors.title = "title not empty"

        const sub = await AppDataSource.getRepository(Sub)
            .createQueryBuilder("sub")
            .where("lower(sub.name) = :name", {name: name.toLowerCase()})
            .getOne();

        if (sub) errors.name = "sub already exits"
        if (Object.keys(errors).length > 0) {
            throw errors;
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Error occurred!"})
    }

    try {
        const user: User = res.locals.user;

        const sub = new Sub();
        sub.name = name;
        sub.description = description;
        sub.title = title;
        sub.user = user;

        await sub.save();
        return res.json(sub)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Error occurred!"})
    }
};
const router = Router();

router.post("/", userMiddleware, authMiddleware, createSub);

export default router;