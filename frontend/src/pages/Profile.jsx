import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRef, useState, useEffect } from 'react';
import axios from '../axios';
import { BiTrash } from "react-icons/bi";

export default function Profile() {
	const { user } = useAuth();
	const aRef = useRef(null);
	const [file, setFile] = useState();
	const [fileData, setFileData] = useState(null);
	const [loading, setLoading] = useState(false);

	function handleChange(event) {
		setFile(event.target.files[0]);
	};

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		const formData = new FormData();
		formData.append('file', file);
		formData.append('filename', file.name);
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		};

		try {
			const resp = await axios.post('uploadfile', formData, config);
			if(resp.status === 200) {
				console.log(resp.data);
				aRef.current.value = null;
				setLoading(false);
				getData();
			}
		} catch (error) {
			if(error.response.status === 401) {
				setLoading(false);
				setError(error.response.data.message)
			}
		}
	};

	async function getData() {
		await axios.get('myfiles').then((response) => {
			setFileData(response.data['data']);
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
			<div className="text-lg font-bold text-slate-600">User Profile</div>
			<hr className="bg-slate-400 h-1 w-full my-4" />
			<div className="block p-10 bg-white border border-gray-200 shadow-xl rounded-lg shadowdark:border-gray-700">
				<h5 className="my-2 text-2xl font-bold tracking-tight">
					Name: {user.name}
				</h5>
				<p className="font-normal text-gray-700">Email: {user.email}</p>
				<p className="font-normal text-gray-700">
					Created At: {user.created_at}
				</p>
			</div>
			<form className="mt-8" onSubmit={handleSubmit}>
				<h1 className='mb-3'>Upload File</h1>
				<input ref={aRef} type="file" onChange={handleChange}/>
				<button
					type='submit'
					className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
						{loading ? <>Uploading..</> : <>Upload</>}
				</button>
			</form>
			<div className='mt-8 flex gap-5 items-center justify-start flex-wrap'>
				{
					fileData && fileData.map((item) => {
						return (
							<div key={'image' + item.id} style={{position: 'relative', width: '170px'}}>
								<button onClick={() => handleDelete(item.id)} style={{position: 'absolute', top: '0', right: '0'}}>
									<BiTrash style={{color: 'red'}} />
								</button>
								<img src={import.meta.env.VITE_STORAGE_BASE_URL + '/' + item.file_path} style={{ width: '150px', height: '100px', objectFit: 'contain'}} />
							</div>
						)
					})
				}
			</div>
		</>
	);
}
