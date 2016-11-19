/**
 * Created by dev on 18.11.2016.
 */
module.exports.sqlCreators = function () {
    return {
        tableAuthScript:
            "CREATE TABLE IF NOT EXISTS `events`.`auth` ( `idAuth` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(25) NOT NULL , `pass` VARCHAR(45) NOT NULL , PRIMARY KEY (`idAuth`)) ENGINE = MyISAM;"
    }
};