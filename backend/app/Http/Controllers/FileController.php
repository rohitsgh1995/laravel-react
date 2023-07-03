<?php

namespace App\Http\Controllers;

use App\Models\Files;
use App\Http\Requests\FileRequest;
use Illuminate\Http\Request;

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
                        'user_id' => 1,
                        'file' => $file,
                        'file_path' => $file_path
                    ]);

                    return response()->json([
                        'status' => true,
                        'message' => 'File uploaded successfully'
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
}
