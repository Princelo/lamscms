<?php
namespace App\Repository;

use App\Domain\Settings;
use PDO;

class SettingsRepository
{
    public function __construct(
        private PDO $pdo
    )
    {
    }

    public function update(Settings $settings): Settings
    {
        $this->pdo->beginTransaction();
        $sql = <<<SQL
            update settings
            set title = :title,
                address = :address,
                sub_title = :subTitle,
                keywords = :keywords,
                description = :description,
                modified_at = :modified_at,
                modified_by = :modified_by
            where id = :id
        SQL;

        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":title", $settings->getTitle());
        $statement->bindValue(":address", $settings->getAddress());
        $statement->bindValue(":subTitle", $settings->getSubTitle());
        $statement->bindValue(":keywords", $settings->getKeywords());
        $statement->bindValue(":description", $settings->getDescription());
        $statement->bindValue(":modified_at", now());
        $statement->bindValue(":modified_by", current_user());
        $statement->bindValue(":id", 1);
        $statement->execute();
        $this->pdo->commit();
        return $this->get();
    }

    public function get(): Settings
    {
        $sql = <<<SQL
            select
                title,
                address,
                sub_title "subTitle",
                keywords,
                description,
                modified_at "modifiedAt",
                modified_by "modifiedBy"
            from settings where id = :id
        SQL;

        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(":id", 1);
        $statement->execute();
        $record = $statement->fetch();
        $record['modifiedAt'] = $record['modifiedAt'] != null ? str_to_date($record['modifiedAt']) : null;
        return new Settings(...$record);
    }

}
