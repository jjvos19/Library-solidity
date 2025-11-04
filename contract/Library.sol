// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract Library {

    // Libro
    struct Book {
        uint256 id;
        string title; // Titulo
        string author; // Autor
        string publisher; // publicacion
        uint year; // año de publicacacion
        bool loan; // Prestamo
    }

    mapping (uint256 => Book) public books;
    string[] public titlesAuthor;
    uint256[] public ids;
    uint256 index;


    // Guarda el libro, si es nuevo.
    function SaveBook(string memory _title, string memory _author, string memory _publisher, uint _year) public {
        bool flag = existBook(_title, _author);
        require(!flag, string.concat("Ya existe este libro: ", generateTitleAuthor(_title, _author)));
        Book memory b2 = Book({title: _title, author: _author, publisher: _publisher, year: _year, id: ++index, loan: false});
        string memory aux = generateTitleAuthor(_title, _author);
        titlesAuthor.push(aux);
        ids.push(index);
        books[b2.id]= b2;
    }

    function onLoan(uint256 _bookId) public {
        require(books[_bookId].id > 0, "No existe el libro!!!");
        Book memory b2 = books[_bookId];
        books[_bookId].loan = !b2.loan;
    }

    function listBooks() public view returns(Book[] memory) {
        Book[] memory list = new Book[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            list[i] = books[ids[i]];
        }
        return list;
    }

    // Devuelve true si existe el libro, caso contrario false.
    function existBook(string memory _title, string memory _author) internal view returns (bool) {
        bool flag = false;
        string memory aux = generateTitleAuthor(_title, _author);
        for (uint i= 0; i < index; i++){
            if (keccak256(abi.encodePacked(aux)) == keccak256(abi.encodePacked(titlesAuthor[i]))){
                flag = true;
                break;
            }
        }
        return flag;
    }

    function generateTitleAuthor(string memory _title, string memory _author) internal pure returns (string memory) {
        return string.concat(_title , " - ", _author);
    }

}