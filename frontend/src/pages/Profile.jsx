import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import axios from 'axios';

export default function Profile() {
	const { user } = useAuth();

	const [file, setFile] = useState();

	function handleChange(event) {
		setFile(event.target.files[0]);
	};

	function handleSubmit(event) {
		event.preventDefault();
		const url = 'http://localhost:8000/api/uploadfile';
		const formData = new FormData();
		formData.append('file', file);
		formData.append('fileName', file.name);
		const config = {
			headers: {
				'content-type': 'multipart/form-data',
			},
		};

		axios.post(url, formData, config).then((response) => {
			console.log(response.data);
		});
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
				<input type="file" onChange={handleChange}/>
				<button
					type='submit'
					className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
						Upload
				</button>
			</form>
		</>
	);
}
