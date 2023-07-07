import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRef, useState, useEffect } from 'react';
import axios from '../axios';

export default function Profile() {
	const { user } = useAuth();

	const aRef = useRef(null);
	const [file, setFile] = useState();

	const [fileData, setFileData] = useState(null);

	function handleChange(event) {
		setFile(event.target.files[0]);
	};

	const handleSubmit = async (e) => {
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
				getData();
			}
		} catch (error) {
			if(error.response.status === 401) {
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
						Upload
				</button>
			</form>
			<div className='mt-8 flex gap-5 items-center justify-center flex-wrap'>
				{
					fileData && fileData.map((item) => {
						return <img key={item.id} src={'http://127.0.0.1:8000/' + item.file_path} style={{ width: '300px', height: 'auto'}} />
					})
				}
			</div>
		</>
	);
}
