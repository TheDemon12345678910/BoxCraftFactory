using Dapper;
using infrastructure.DataModels;
using infrastructure.QueryModels;
using Npgsql;

namespace infrastructure.Repositories;

public class BoxRepository
{
    private NpgsqlDataSource _dataSource;

    public BoxRepository(NpgsqlDataSource datasource)
    {
        _dataSource = datasource;
    }

    public IEnumerable<BoxFeedQuery> GetBoxesForFeed()
    {
        string sql = $@"
SELECT box_id as {nameof(BoxFeedQuery.BoxId)},
       box_title as {nameof(BoxFeedQuery.BoxTitle)},
        box_height as {nameof(BoxFeedQuery.BoxHeight)},
        box_width as {nameof(BoxFeedQuery.BoxWidth)},
        box_length as {nameof(BoxFeedQuery.BoxLength)},
        box_price as {nameof(BoxFeedQuery.BoxPrice)},
        box_type as {nameof(BoxFeedQuery.BoxType)},
        box_img_url as {nameof(BoxFeedQuery.BoxImgUrl)}
FROM boxfactory.box;
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<BoxFeedQuery>(sql);
        }
    }


    public Box UpdateBox(Box dto)
    {
        string boxTitle = dto.BoxTitle;
        int boxId = dto.BoxId;
        double boxHeight = dto.BoxHeight;
        double boxWidth = dto.BoxWidth;
        double boxLength = dto.BoxLength;
        double boxPrice = dto.BoxPrice;
        string boxType = dto.BoxType;
        string boxImgUrl = dto.BoxImgUrl;

        var sql = $@"
UPDATE boxfactory.box SET box_title = @boxTitle, box_height = @boxHeight, box_width = @boxWidth, box_length=@boxLength, box_price=@boxPrice, box_type=@boxType, box_img_url = @boxImgUrl
WHERE box_id = @boxId
RETURNING box_id as {nameof(BoxFeedQuery.BoxId)},
        box_title as {nameof(BoxFeedQuery.BoxTitle)},
        box_height as {nameof(BoxFeedQuery.BoxHeight)},
        box_width as {nameof(BoxFeedQuery.BoxWidth)},
        box_length as {nameof(BoxFeedQuery.BoxLength)},
        box_price as {nameof(BoxFeedQuery.BoxPrice)},
        box_type as {nameof(BoxFeedQuery.BoxType)},
        box_img_url as {nameof(BoxFeedQuery.BoxImgUrl)};
";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Box>(sql, new { boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl, boxId});
        }
    }

    public Box CreateBox(string boxTitle, double boxHeight, double boxWidth, double boxLength, double boxPrice, string boxType, string boxImgUrl)
    {
        var sql = $@"
INSERT INTO boxfactory.box (box_title, box_height, box_width, box_length, box_price, box_type, box_img_url) 
VALUES (@boxTitle, @boxHeight, @boxWidth, @boxLength, @boxPrice, @boxType, @boxImgUrl)
RETURNING box_id as {nameof(Box.BoxId)},
        box_title as {nameof(Box.BoxTitle)},
        box_height as {nameof(Box.BoxHeight)},
        box_width as {nameof(Box.BoxWidth)},
        box_length as {nameof(Box.BoxLength)},
        box_price as {nameof(Box.BoxPrice)},
        box_type as {nameof(Box.BoxType)},
        box_img_url as {nameof(Box.BoxImgUrl)};
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Box>(sql, new { boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl });
        }
    }

    public bool DeleteBox(int boxId)
    {
        var sql = @"DELETE FROM boxfactory.box WHERE box_id = @boxId;";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Execute(sql, new { boxId }) == 1;
        }
    }

    public bool DoesBoxtWithTitleExist(string boxTitle)
    {
        var sql = @"SELECT COUNT(*) FROM boxfactory.box WHERE box_title = @boxTitle;";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.ExecuteScalar<int>(sql, new { boxTitle }) == 1;
        }
    }
}