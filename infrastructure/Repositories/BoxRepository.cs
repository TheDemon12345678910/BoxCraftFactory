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
        box_widht as {nameof(BoxFeedQuery.BoxWidth)},
        box_length as {nameof(BoxFeedQuery.BoxLength)},
        box_price as {nameof(BoxFeedQuery.BoxPrice)},
        box_type as {nameof(BoxFeedQuery.BoxType)},
        box_img_url as {nameof(BoxFeedQuery.BoxImgUrl)}
FROM library_app.boxes;
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
UPDATE library_app.boxes SET box_title = @boxTitle, box_height = @boxHeight, box_widht = @boxWidth, box_length=@boxLength, box_price=@boxPrice, box_type=@boxType, box_img_url = @boxImgUrl
WHERE box_id = @boxId
RETURNING box_id as {nameof(BoxFeedQuery.BoxId)},
        box_title as {nameof(BoxFeedQuery.BoxTitle)},
        box_height as {nameof(BoxFeedQuery.BoxHeight)},
        box_widht as {nameof(BoxFeedQuery.BoxWidth)},
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

    public Box CreateBox(string boxTitle, string publisher, string coverImgUrl, string author)
    {
        var sql = $@"
INSERT INTO library_app.boxes (box_title, publisher, author, cover_img_url) 
VALUES (@boxTitle, @publisher, @author, @coverImgUrl)
RETURNING box_id as {nameof(BoxFeedQuery.BoxId)},
        box_title as {nameof(BoxFeedQuery.BoxTitle)},
        box_height as {nameof(BoxFeedQuery.BoxHeight)},
        box_widht as {nameof(BoxFeedQuery.BoxWidth)},
        box_length as {nameof(BoxFeedQuery.BoxLength)},
        box_price as {nameof(BoxFeedQuery.BoxPrice)},
        box_type as {nameof(BoxFeedQuery.BoxType)},
        box_img_url as {nameof(BoxFeedQuery.BoxImgUrl)};
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Box>(sql, new { boxTitle, publisher, author, coverImgUrl });
        }
    }

    public bool DeleteBox(int boxId)
    {
        var sql = @"DELETE FROM library_app.boxes WHERE box_id = @boxId;";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Execute(sql, new { boxId }) == 1;
        }
    }

    public bool DoesBoxtWithTitleExist(string boxTitle)
    {
        var sql = @"SELECT COUNT(*) FROM library_app.boxes WHERE box_title = @boxTitle;";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.ExecuteScalar<int>(sql, new { boxTitle }) == 1;
        }
    }
}