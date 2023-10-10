using System.ComponentModel.DataAnnotations;

namespace api.TransferModels;

public class UpdateBoxRequestDto
{
        [MinLength(4)]
        public string boxTitle { get; set; }
        public int boxId { get; set; }
        public double boxHeight { get; set; }
        public double boxWidth { get; set; }
        public double boxLength { get; set; }
        public double boxPrice { get; set; }
        public string boxType { get; set; }
        public string boxImgUrl { get; set; }
}