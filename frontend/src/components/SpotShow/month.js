
const Month = ({review}) => {
  const array = review.createdAt.split('-');
  let month;

  if(array[1] === '08') month = 'August';
  else if(array[1] === '01') month = 'January';
  else if(array[1] === '02') month = 'February';
  else if(array[1] === '03') month = 'March';
  else if(array[1] === '04') month = 'April';
  else if(array[1] === '05') month = 'May';
  else if(array[1] === '06') month = 'June';
  else if(array[1] === '07') month = 'July';
  else if(array[1] === '09') month = 'September';
  else if(array[1] === '10') month = 'October';
  else if(array[1] === '11') month = 'November';
  else month = 'December';

  return (
    <div>
      {month} {array[0]}
    </div>
  )
}

export default Month;
