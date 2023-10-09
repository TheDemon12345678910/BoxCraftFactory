using System.ComponentModel.DataAnnotations;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace service;

public class BoxService
{
    private readonly BoxRepository _boxRepository;

    public BoxService(BoxRepository boxRepository)
    {
        _boxRepository = boxRepository;
    }

    public IEnumerable<BoxFeedQuery> GetBoxesForFeed()
    {
        return _boxRepository.GetBoxesForFeed();
    }

    public Box CreateBox(string boxTitle, double boxHeight, double boxWidth, double boxLength, double boxPrice,
        string boxType, string boxImgUrl)
    {
        try
        {
            var doesBoxExist = _boxRepository.DoesBoxtWithTitleExist(boxTitle);
            if (doesBoxExist)
            {
                throw new ValidationException("Box already exists with title " + boxTitle);
            }

            return _boxRepository.CreateBox(boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl);
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException);
            Console.WriteLine(e.StackTrace);
            throw new Exception("Err");
        }
    }

    public Box UpdateBox(Box boxen)
    {
        return _boxRepository.UpdateBox(boxen);
    }

    public void DeleteBox(int boxId)
    {
        var result = _boxRepository.DeleteBox(boxId);
        if (!result)
        {
            throw new Exception("Could not insert box");
        }
    }

    public List<Box> SearchForBox(string searchTerm)
    {
        List<Box> result = _boxRepository.FindBoxes(searchTerm);

        if (result == null || result.Count == 0)
        {
            throw new Exception("Could not find box");
        }

        return result;
    }
}