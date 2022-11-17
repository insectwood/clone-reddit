import InputGroup from "../../components/InputGroup";
import {FormEvent, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";

const SubCreate = () => {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<any>({});
    let router = useRouter();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const res = await axios.post("/subs", {name, title, description})
            router.push(`/r/${res.data.name}`);
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data);
        }
    }

    return (
        <div className="flex flex-col justify-center pt-16">
            <div className="w-10/12 mx-auto md:w-96">
                <h1 className="mb-2 text-lg font-medium">
                    Create Community
                </h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="my-6">
                        <p className="font-medium">Title</p>
                        <p className="mb-2 text-xs text-gray-400">
                            언제든지 변경가능
                        </p>
                        <InputGroup
                            placeholder="name"
                            value={name}
                            error={errors.name}
                            setValue={setName}
                        />
                    </div>
                    <div className="my-6">
                        <p className="font-medium">Title</p>
                        <p className="mb-2 text-xs text-gray-400">
                            언제든지 변경가능
                        </p>
                        <InputGroup
                            placeholder="title"
                            value={title}
                            error={errors.title}
                            setValue={setTitle}
                        />
                    </div>
                    <div className="my-6">
                        <p className="font-medium">Description</p>
                        <p className="mb-2 text-xs text-gray-400">
                            해당 커뮤니티에 대한 설명
                        </p>
                        <InputGroup
                            placeholder="description"
                            value={description}
                            error={errors.description}
                            setValue={setDescription}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="px-4 py-1 text-sm font-semibold rounded text-white bg-gray-400 border"
                        />
                        Create Community
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SubCreate