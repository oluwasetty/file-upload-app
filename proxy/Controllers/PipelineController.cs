using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Proxy.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PipelineController : ControllerBase
{
    private readonly HttpClient httpClient;

    public PipelineController(IHttpClientFactory httpClientFactory)
    {
        httpClient = httpClientFactory.CreateClient();
        httpClient.BaseAddress = new Uri("https://staging.api.dragonflyai.co");
        // Optionally, you can set default headers or timeout values for the HttpClient.
        // httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        // httpClient.Timeout = TimeSpan.FromSeconds(30);
    }
    
    [HttpPut("upload-to-s3")]
    public async Task<IActionResult> UploadToS3([FromForm] UploadToS3Request request)
    {
        try
        {
            // Replace "your_presigned_url" with the actual S3 presigned URL
            string presignedUrl = request.S3PresignedUrl;

            // Convert the uploaded file to binary data
            byte[] fileBytes;
            using (var memoryStream = new MemoryStream())
            {
                await request.FileData.CopyToAsync(memoryStream);
                fileBytes = memoryStream.ToArray();
            }
            
            // Create a ByteArrayContent from the file data
            ByteArrayContent content = new ByteArrayContent(fileBytes);

            // Send the PUT request with the signed URL
            HttpResponseMessage response = await httpClient.PutAsync(presignedUrl, content);

            // Check the response status
            if (response.IsSuccessStatusCode)
            {
                return Ok("File uploaded successfully to S3.");
            }
            else
            {
                return BadRequest("Error occurred while uploading to S3. Status: " + response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }
    
    [HttpPost("status")]
    public async Task<IActionResult> PostStatus([FromHeader] string apiKey,
        [FromBody] StatusBody statusBody)
    {
        try
        {
            // Add authorization header for this specific request
            httpClient.DefaultRequestHeaders.Clear();
            httpClient.DefaultRequestHeaders.Add("Authorization", $"{apiKey}");
            httpClient.DefaultRequestHeaders.Add("Cache-Control", "no-store");
            httpClient.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));
            // httpClient.DefaultRequestHeaders.Add("Content-Type", "application/json");

            // Construct the request body
            var requestBody = new
            {
                taskId = statusBody.TaskId
            };

            // Serialize the request body to JSON
            var jsonRequestBody = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);

            // Convert JSON string to StringContent
            var content = new StringContent(jsonRequestBody, Encoding.UTF8, "application/json");

            // Send the POST request
            HttpResponseMessage response = await httpClient.PostAsync("/pipeline/assets/status", content);

            // Check the response status
            if (response.IsSuccessStatusCode)
            {
                string responseContent = await response.Content.ReadAsStringAsync();
                return Ok(responseContent);
            }
            else
            {
                return BadRequest("Error occurred while making the request. Status: " + response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }
}

public class UploadToS3Request
{
    public IFormFile FileData { get; set; }
    public string S3PresignedUrl { get; set; }
}

public class StatusBody
{
    public string TaskId { get; set; }
}