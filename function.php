function fetch_multi_row($kwd, $slimit){
   global $debug, $connected, $limit, $offset, $total_data;
   $result = true;
   try {
       $condition = $where = '';
       if(!empty($slimit))
      {
        $limit = $slimit;
        $setLimit .= ' LIMIT :offset, :limit ';
      }
      if(!empty($kwd))
      {
        if(!empty($condition)) $condition .= ' AND ';
        $condition .= ' (username LIKE :kwd OR name LIKE :kwd) ';
      }
       $sql = 'SELECT username, id, mongo_id,
               (SELECT COUNT(*) FROM `reporter`) AS total
               FROM `reporter` ORDER BY id ASC '.$setLimit;
       $stmt = $connected->prepare($sql);
       if(!empty($kwd)) $stmt->bindValue(':kwd', '%'. $kwd .'%', PDO::PARAM_STR);
       if(!empty($srid)) $stmt->bindValue(':srid', (int)$srid, PDO::PARAM_INT);
       if(!empty($slimit))
       {
         $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
         $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
       }
       $stmt->execute();
       $row = $stmt->fetchAll();
       if (count($row) > 0) $total_data = $row[0]['total'];
       return $row;
   } catch (Exception $e) {
       $result = false;
       if($debug)  echo 'Errors: fetch_multi_row'.$e->getMessage();
   }
   return $result;
}
