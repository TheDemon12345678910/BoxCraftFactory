using System.ComponentModel.DataAnnotations;
using api.CustomDataAnnotations;

namespace api.TransferModels;

public class CreateBoxRequestDto
{
    [MinLength(5)]
    public string BoxTitle { get; set; }
    public double BoxHeight  { get; set; }
    public double BoxWidth  { get; set; }
    public double BoxLength  { get; set; }
    public double BoxPrice  { get; set; }
    public string BoxType { get; set; }  
    public string BoxImgUrl { get; set; }   
    
   // [ValueIsOneOf(new string[] {"publisher_1", "publisher_2"}, "Must be one one ...")]
    
    
}