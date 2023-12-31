"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Customers", [
      {
        id_account: 1,
        name: "Nguyễn Thành Trung",
        email: "n19dccn216@student.ptithcm.edu.vn",
        phone: "0123456789",
        address: "Cầu Xã Tĩnh, Bình Lợi, Huyện Bình Chánh, Thành phố Hồ Chí Minh",
        image: "https://thuthuatnhanh.com/wp-content/uploads/2021/02/Avatar-ngau-dep.jpg"
      },
      {
        id_account: 5,
        name: "Phạm Minh Mạnh",
        email: "phammanhbeo2001@gmail.com",
        phone: "0631231189",
        address: "Xã Quang Trung, Huyện Thống Nhất, Tỉnh Đồng Nai",
        image: "https://thuthuatnhanh.com/wp-content/uploads/2021/02/Avatar-ngau-dep.jpg"
      },
      {
        id_account: 2,
        name: "Khách đặt tại quán",
        email: "khachdattaiquan@gmail.com",
        phone: "0000000000",
        address: "Khách đặt tại quán",
        image: ""
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
