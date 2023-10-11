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
            ResponseData = _boxService.CreateBox(dto.BoxTitle, dto.BoxHeight, dto.BoxWidth, dto.BoxLength, dto.BoxPrice, dto.BoxType, dto.BoxImgUrl)
        };
    }

    [HttpPut]
    [ValidateModel]
    [Route("/api/boxes/{boxId}")]
    public ResponseDto Put([FromRoute] int boxId,
        [FromBody] UpdateBoxRequestDto dto)
    {
        HttpContext.Response.StatusCode = 201;
        Box boxen = new Box
        {
            boxType = dto.boxType,
            boxWidth = dto.boxWidth,
            boxHeight = dto.boxHeight,
            boxLength = dto.boxLength,
            boxId = dto.boxId,
            boxPrice = dto.boxPrice,
            boxImgUrl = dto.boxImgUrl,
            boxTitle = dto.boxTitle
        };
        return new ResponseDto()
        {
            MessageToClient = "Successfully updated",
            ResponseData =
                _boxService.UpdateBox(boxen)
        };

    }

    [HttpDelete]
    [Route("/api/boxes/{boxId}")]
    public ResponseDto Delete([FromRoute] int boxId)
    {
        _boxService.DeleteBox(boxId);
        return new ResponseDto()
        {
            MessageToClient = "Succesfully deleted"
        };

    }
    
    [HttpGet]
    [Route("/api/FindBox")]
    public ResponseDto SearchForBoxes([FromQuery]string searchTerm, string typeOfBox)
    {
        // Validate input
        if (string.IsNullOrEmpty(searchTerm) && string.IsNullOrEmpty(typeOfBox))
        {
            throw new ArgumentException("At least one of searchTerm or typeOfBox must be provided.");
        }

        if (!string.IsNullOrEmpty(searchTerm) && searchTerm.Length <= 3)
        {
            throw new ArgumentException("Invalid search term. The length must be greater than 3 characters.");
        }
        
        return new ResponseDto()
        {
            MessageToClient = "Successfully fetched",
            ResponseData = _boxService.SearchForBox(searchTerm, typeOfBox)
        };
    }

}


