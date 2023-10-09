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
SELECT *
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
UPDATE boxfactory.box SET boxTitle = @boxTitle, boxHeight = @boxHeight, boxWidth = @boxWidth, boxLength=@boxLength, boxPrice=@boxPrice, boxType=@boxType, boxImgUrl = @boxImgUrl
WHERE boxId = @boxId
RETURNING *;
";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Box>(sql, new { boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl, boxId});
        }
    }

    public Box CreateBox(string boxTitle, double boxHeight, double boxWidth, double boxLength, double boxPrice, string boxType, string boxImgUrl)
    {
        var sql = $@"
INSERT INTO boxfactory.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) 
VALUES (@boxTitle, @boxHeight, @boxWidth, @boxLength, @boxPrice, @boxType, @boxImgUrl)
RETURNING *;
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Box>(sql, new { boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl });
        }
    }

    public bool DeleteBox(int boxId)
    {
        var sql = @"DELETE FROM boxfactory.box WHERE boxId = @boxId;";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Execute(sql, new { boxId }) == 1;
        }
    }

    public bool DoesBoxtWithTitleExist(string boxTitle)
    {
        var sql = @"SELECT COUNT(*) FROM boxfactory.box WHERE boxTitle = @boxTitle;";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.ExecuteScalar<int>(sql, new { boxTitle }) == 1;
        }
    }
    
    public List<Box> FindBoxes(string searchTerm)
    {
        var sql = @"SELECT *
FROM boxfactory.box WHERE boxTitle LIKE '%' || @searchTerm || '%';";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<Box>(sql, new {searchTerm}).ToList();
        }
    }
}