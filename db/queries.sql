#displaying production of all workers within given timeframe (ignore workers who have not worked in this timeframe)

select workers.wid,workers.fname,workers.lname,sum(spinning_prod.m_prod) as worker_prod from spinning_prod inner join workers on spinning_prod.wid=workers.wid where m_date between '2019-10-11' and '2019-10-14' group by wid order by worker_prod asc;

#displaying names of workers who were idle in the given timeframe

select distinct wid,fname,lname from workers where wid not in (select workers.wid from spinning_prod inner join workers on spinning_prod.wid=workers.wid where m_date between '2019-10-11' and '2019-10-14' group by wid );

#displaying production at induvidial machine level within given time frame

select m_id,sum(m_prod) as machine_production ,round(sum(m_waste),2) as machine_waste from spinning_prod where m_date between '2019-10-11' and '2019-10-14' group by m_id;

#display buildings and their productivity

select spinning_type.bid,sum(spinning_prod.m_prod) as building_prod from spinning_prod inner join spinning_type on spinning_prod.m_id=spinning_type.m_id where m_date between '2019-10-11' and '2019-10-14' group by bid;

#displaing maximum used type of raw material in time frame

#select sum_table.item_code,max(sum_table.item_qty_used) from (select spinning_prod.item_no as item_code ,sum(raw_materials.qty) as item_qty_used from spinning_prod inner join raw_materials on spinning_prod.item_no=raw_materials.item_no and spinning_prod.lot_no=raw_materials.lot_no where m_date between '2019-10-11' and '2019-10-13' group by spinning_prod.item_no) as sum_table;

select item_no,item_name from raw_material_name where raw_material_name.item_no =(select t.item_code as maximum_used_amt from (select spinning_prod.item_no as item_code ,sum(raw_materials.qty) as item_qty_used from spinning_prod inner join raw_materials on spinning_prod.item_no=raw_materials.item_no and spinning_prod.lot_no=raw_materials.lot_no where m_date between '2019-10-11' and '2019-10-14' group by spinning_prod.item_no order by item_qty_used desc) as t limit 1);

#connection

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Luckyusa1';
flush privileges;



