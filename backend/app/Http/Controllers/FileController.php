<?php

namespace App\Http\Controllers;

use App\Models\Files;
use App\Http\Requests\FileRequest;
use Illuminate\Http\Request;
use App\Http\Resources\FileResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function uploadFile(FileRequest $request)
    {
        try
        {
            $data = $request->validated();

            if(isset($data['file']))
            {
                $file = 'file_'.time().'.'.$data['file']->extension();
                $file_path = 'storage/myfiles/'.$file;

                $upload = $data['file']->storeAs('myfiles', $file, 'public');

                if($upload)
                {
                    Files::create([
                        'user_id' => Auth::user()->id,
                        'file' => $file,
                        'file_path' => $file_path
                    ]);

                    return response()->json([
                        'status' => true,
                        'message' => 'File uploaded successfully.'
                    ], 200);
                }
                else
                {
                    return response()->json([
                        'status' => false,
                        'message' => 'Uploading failed. Try again!'
                    ], 401);
                }
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function getFiles()
    {
        return FileResource::collection(Files::where('user_id', Auth::user()->id)->orderBy('id', 'desc')->get());
    }

    public function deleteFile(int $id)
    {
        try
        {
            $file = Files::findOrFail($id);

            $delete_from_dir = Storage::disk('public')->delete('myfiles/'.$file->file);

            if($delete_from_dir)
            {
                $delete_from_db = $file->delete();

                if($delete_from_db)
                {
                    return response()->json([
                        'status' => true,
                        'message' => 'File deleted successfully.'
                    ], 200);
                }
                else
                {
                    return response()->json([
                        'status' => false,
                        'message' => 'File deleted from storage but not from database.'
                    ], 401);
                }
            }
            else
            {
                return response()->json([
                    'status' => false,
                    'message' => 'Something went wrong. Try again!'
                ], 401);
            }

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
