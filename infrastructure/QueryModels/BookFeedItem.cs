namespace infrastructure.QueryModels;

public class BoxFeedQuery
{
    public string BoxTitle { get; set; }
    public int BoxId { get; set; }
    public double BoxHeight { get; set; }
    public double BoxWidth { get; set; }
    public double BoxLength { get; set; }
    public double BoxPrice { get; set; }
    public string BoxType { get; set; }
    public string BoxImgUrl { get; set; }
}
