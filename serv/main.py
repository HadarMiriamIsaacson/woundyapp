from fastapi import FastAPI, Body, UploadFile, Response
from test_analysis import tests_analysis
import aiohttp
import os
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",  # Allows specific origins
    allow_credentials=True,  # Allows cookies and credentials
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# sagi@gmail.com, 123456
# ron@hotmail.com 123456
# amir@gmail.com 123456
async def download_file(file_url: str, file_name: str):
    # Ensure temp directory exists
    temp_dir = Path("temp")
    temp_dir.mkdir(exist_ok=True)

    file_path = temp_dir / file_name

    # Download the file from the provided URL
    async with aiohttp.ClientSession() as session:
        async with session.get(file_url) as response:
            if response.status == 200:
                # Save the file locally
                with open(file_path, "wb") as file:
                    contents = await response.read()
                    file.write(contents)
            else:
                raise Exception(f"Failed to download file: {response.status}")

    return file_path


@app.post("/upload_test")
async def upload_test(file_url: str = Body(embed=True)):
    print("Entered")
    # Extract the file name from the URL or use a default
    file_name = file_url.split("/")[-1]  # Get the last part of the URL as the file name
    try:
        # Step 1: Download the file
        path = await download_file(file_url, file_name)

        # Step 2: Process the file (e.g., tests_analysis)
        return Response(
            tests_analysis(
                str(path)
            ),  # Assuming tests_analysis accepts the file path as input
            status_code=200,
            headers={"Content-Type": "application/json"},
        )
    except Exception as e:
        return Response(
            content=f"Failed to process file: {str(e)}",
            status_code=500,
            headers={"Content-Type": "application/json"},
        )
