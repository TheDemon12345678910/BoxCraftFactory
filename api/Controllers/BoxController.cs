using System.ComponentModel.DataAnnotations;
using api.CustomDataAnnotations;
using api.Filters;
using api.TransferModels;
using infrastructure.DataModels;
using infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using service;

namespace library.Controllers;


public class BoxController : ControllerBase
{

    private readonly ILogger<BoxController> _logger;
    private readonly BoxService _boxService;

    public BoxController(ILogger<BoxController> logger,
        BoxService boxService)
    {
        _logger = logger;
        _boxService = boxService;
    }



    [HttpGet]
    [Route("/api/boxes")]
    public ResponseDto GetAllBoxes()
    {
        HttpContext.Response.StatusCode = 200;
        return new ResponseDto()
        {
            MessageToClient = "Successfully fetched",
            ResponseData = _boxService.GetBoxesForFeed()
        };
    }

    [HttpPost]
    [ValidateModel]
    [Route("/api/boxes")]
    public ResponseDto Post([FromBody] CreateBoxRequestDto dto)
    {
        HttpContext.Response.StatusCode = StatusCodes.Status201Created;
        return new ResponseDto()
        {
            MessageToClient = "Successfully created a box",
            ResponseData = _boxService.CreateBox(dto.BookTitle, dto.Publisher, dto.CoverImgUrl, dto.Author)
        };
    }

    [HttpPut]
    [ValidateModel]
    [Route("/api/boxes/{bookId}")]
    public ResponseDto Put([FromRoute] int bookId,
        [FromBody] UpdateBoxRequestDto dto)
    {
        HttpContext.Response.StatusCode = 201;
        Box boxen = new Box(dto.BoxTitle, dto.BoxId, dto.BoxHeight, dto.BoxWidth, dto.BoxLength, dto.BoxPrice, dto.BoxType, dto.BoxImgUrl);
        return new ResponseDto()
        {
            MessageToClient = "Successfully updated",
            ResponseData =
                _boxService.UpdateBox(boxen)
        };

    }

    [HttpDelete]
    [Route("/api/boxes/{bookId}")]
    public ResponseDto Delete([FromRoute] int bookId)
    {
        _boxService.DeleteBox(bookId);
        return new ResponseDto()
        {
            MessageToClient = "Succesfully deleted"
        };

    }
}


