import React from 'react';
import { useState, useEffect } from 'react';
import axios from '../axios';
import { BiTrash } from "react-icons/bi";

export default function Files() {
    const [userFiles, setUserFiles] = useState(null);

    async function getData() {
        await axios.get('user/files').then((response) => {
            setUserFiles(response.data['data']);
            console.log(response.data['data']);
        });
    };

    useEffect(() => {
        getData();
    }, []);

    const handleDelete = async (id) => {
		console.log(id);
		
		try {
			const resp = await axios.delete('delete/file/' + id);
			if(resp.status === 200) {
				console.log(resp.data);
				getData();
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<div className="text-xl font-bold text-slate-600">User Files</div>
			<hr className="bg-slate-400 h-1 w-full my-4" />
            <div className='mt-8 flex flex-col gap-5'>
                {
                    userFiles && userFiles.map((user) => {
                        return (
                            <div key={'user' + user.id}>
                                <div className="text-xl font-bold text-slate-600">{user.name}</div>
                                <div className='mt-8 flex gap-5 items-center justify-start flex-wrap'>
                                    {
                                        user.files && user.files.map((file) => {
                                            return (
                                                <div key={'image' + file.id} style={{position: 'relative', width: '170px'}}>
                                                    <button onClick={() => handleDelete(file.id)} style={{position: 'absolute', top: '0', right: '0'}}>
                                                        <BiTrash style={{color: 'red'}} />
                                                    </button>
                                                    <img src={import.meta.env.VITE_STORAGE_BASE_URL + '/' + file.file_path} style={{ width: '150px', height: '100px', objectFit: 'contain'}} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <hr className="bg-slate-400 h-1 w-full my-4" />
                            </div>
                        )
                    })
                }
            </div>
		</>
	);
}
