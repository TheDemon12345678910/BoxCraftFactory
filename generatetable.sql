DROP TABLE BOXFACTORY.box;
DROP SCHEMA BOXFACTORY;

CREATE SCHEMA BOXFACTORY;
CREATE TABLE BOXFACTORY.box
(
    boxTitle varchar(100) NOT NULL,
    boxId SERIAL PRIMARY KEY,
    boxHeight float NOT NULL,
    boxWidth float NOT NULL,
    boxLength float NOT NULL,
    boxPrice float NOT NULL,
    boxType varchar(50) NOT NULL,
    boxImgUrl varchar(1000)
);

SELECT * FROM BOXFACTORY.box;




insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Flat box', 49, 38, 14, 46, 'Cardboard', 'https://www.ulfbolighus.dk/wp-content/uploads/2022/05/C915C1EFDF2F4F38A6D8B34FB73CC787.png');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Flat higher box', 76, 95, 89, 67, 'Cardboard', 'https://m.media-amazon.com/images/I/51BWXeC5qPL._AC_UF1000,1000_QL80_.jpg');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Biltema box', 3, 19, 75, 76, 'Cardboard', 'https://productimages.biltema.com/v1/image/app/imagebyfilename/28-661_xl_1.jpg');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Big box', 33, 40, 97, 31, 'Cardboard', 'https://springpack.co.uk/app/uploads/2020/12/Big-Box-1.jpg');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Open box', 98, 13, 38, 23, 'Cardboard', 'https://ecobox.co.za/wp-content/uploads/2023/08/Stock-1-Single-Wall-Box-new.jpg');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Dark grey box', 27, 22, 19, 49, 'Cardboard', 'https://www.ikea.com/ph/en/images/products/tjog-storage-box-with-lid-dark-gray__0921586_pe787908_s5.jpg');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Blue cubic box', 77, 58, 75, 49, 'Cardboard', 'https://www.boxmart.co.uk/cdn/shop/products/IMG_0057_d501a604-a15d-41bc-bad0-ab2b312811ba_384x304.jpg?v=1666693184');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Red gift box', 26, 17, 100, 40, 'Cardboard', 'https://5.imimg.com/data5/KA/QG/MY-69672094/gift-box.jpg');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Computer box', 60, 63, 57, 9, 'Cardboard', 'https://auspost.com.au/shop/static/WFS/AusPost-Shop-Site/-/AusPost-Shop/en_AU/product/90442/1/resized_560x560.png');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Shoe box', 12, 35, 95, 18, 'Cardboard', 'https://undefinedmarket.dk/cdn/shop/products/UndefinedMarketMysteryBox.png?v=1644246560');
insert into BOXFACTORY.box (boxTitle, boxHeight, boxWidth, boxLength, boxPrice, boxType, boxImgUrl) values ('Purple box', 94, 35, 82, 42, 'Cardboard', 'https://smstationery.com.ph/cdn/shop/products/10083193a-minGlossyStorageBoxPastelColors.png?v=1649303539');


SELECT * FROM BOXFACTORY.box;