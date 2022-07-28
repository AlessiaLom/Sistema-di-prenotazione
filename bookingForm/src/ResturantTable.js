import MaterialTable from "material-table"

export default function ResturantTable() {
    return (
      <MaterialTable
        title="Servizi offerti"
        columns={[
          { title: 'ActivityName', field: 'name', type: 'string' },
          { title: 'StartTine', field: 'startime', type: 'string' },
          { title: 'EndTime', field: 'endtime', type: 'string' },
          { title: 'Days', field: 'days', type: 'string'},
        ]}
        data={[
            { name: 'Colazione', startime: '7:00', endtime: '11:00', days: 'Mar Mer Gio Ven Sab Dom' },
            { name: 'Pranzo', startime: '12:00', endtime: '15:00', days: 'Ven Sab Dom' },
            { name: 'Aperitivo', startime: '17:00', endtime: '19:00', days: 'Mer Gio Ven Sab Dom' },
            { name: 'Cena', startime: '19:00', endtime: '22:00', days: 'Mer Gio Ven Sab Dom' },
            { name: 'Drink', startime: '22:00', endtime: '1:00', days: 'Gio Ven Sab' },
        ]}
      />
    )
  }