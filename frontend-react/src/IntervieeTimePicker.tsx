import React from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, Page, getJson, setOptions } from '@mobiscroll/react';

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

function IntervieweeTimePicker() {
    const [multiple, setMultiple] = React.useState([
        '2021-10-11T00:00',
        '2021-10-16T00:00',
        '2021-10-17T00:00'
    ]);
    const min = '2021-10-23T00:00';
    const max = '2022-04-23T00:00';
    const [singleLabels, setSingleLabels] = React.useState([]);
    const [singleInvalid, setSingleInvalid] = React.useState([]);
    const [datetimeLabels, setDatetimeLabels] = React.useState([]);
    const [datetimeInvalid, setDatetimeInvalid] = React.useState([]);
    const [multipleLabels, setMultipleLabels] = React.useState([]);
    const [multipleInvalid, setMultipleInvalid] = React.useState([]);
    
    const onPageLoadingSingle = React.useCallback((event, inst) => {
        getPrices(event.firstDay, (bookings: any) => {
            setSingleLabels(bookings.labels);
            setSingleInvalid(bookings.invalid);
        	
        });
    }, []);
    
    const onPageLoadingDatetime = React.useCallback((event, inst) => {
        getDatetimes(event.firstDay, (bookings: any) => {
            setDatetimeLabels(bookings.labels);
            setDatetimeInvalid(bookings.invalid);
        });
    }, []);
    
    const onPageLoadingMultiple = React.useCallback((event, inst) => {
        getBookings(event.firstDay, (bookings: any) => {
            setMultipleLabels(bookings.labels);
            setMultipleInvalid(bookings.invalid);
        });
    }, []);

    const getPrices = (d: any, callback: any) => {
        let invalid: any = [];
        let labels: any = [];

        getJson('https://trial.mobiscroll.com/getprices/?year=' + d.getFullYear() + '&month=' + d.getMonth(), (bookings) => {
            for (let i = 0; i < bookings.length; ++i) {
                const booking = bookings[i];
                const d = new Date(booking.d);

                if (booking.price > 0) {
                    labels.push({
                        start: d,
                        title: '$' + booking.price,
                        textColor: '#e1528f'
                    });
                } else {
                    invalid.push(d);
                }
            }
            callback({ labels: labels, invalid: invalid });
        }, 'jsonp');
    }
    
    const getDatetimes = (d: any, callback: any) => {
        let invalid: any = [];
        let labels: any = [];

        getJson('https://trial.mobiscroll.com/getbookingtime/?year=' + d.getFullYear() + '&month=' + d.getMonth(), (bookings) => {
            for (let i = 0; i < bookings.length; ++i) {
                const booking = bookings[i];
                const bDate = new Date(booking.d);

                if (booking.nr > 0) {
                    labels.push({
                        start: bDate,
                        title: booking.nr + ' SPOTS',
                        textColor: '#e1528f'
                    });
                    invalid = [...invalid, ...booking.invalid];
                } else {
                    invalid.push(d);
                }
            }
            callback({ labels: labels, invalid: invalid });
        }, 'jsonp');
    }
    
    const getBookings = (d: any, callback: any) => {
        let invalid: any = [];
        let labels: any = [];

        getJson('https://trial.mobiscroll.com/getbookings/?year=' + d.getFullYear() + '&month=' + d.getMonth(), (bookings) => {
            for (let i = 0; i < bookings.length; ++i) {
                const booking = bookings[i];
                const d = new Date(booking.d);

                if (booking.nr > 0) {
                    labels.push({
                        start: d,
                        title: booking.nr + ' SPOTS',
                        textColor: '#e1528f'
                    });
                } else {
                    invalid.push(d);
                }
            }
            callback({ labels: labels, invalid: invalid });
        }, 'jsonp');
    }

    return (
        <Page className="md-calendar-booking">
            <div className="mbsc-form-group">
                <div className="mbsc-form-group-title">Select date & time</div>
                <Datepicker 
                    display="inline"
                    controls={['calendar', 'timegrid']}
                    min={min}
                    max={max}
                    minTime="08:00"
                    maxTime="19:59"
                    stepMinute={60}
                    // width={null}
                    labels={datetimeLabels}
                    invalid={datetimeInvalid}
                    onPageLoading={onPageLoadingDatetime}
                    cssClass="booking-datetime"
                />
            </div>
        </Page>
    );
}

export default IntervieweeTimePicker;
