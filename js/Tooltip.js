import * as Config from './Config.js';

// use a tooltip to show node info
export const tooltip_div = d3.select('body')
   .append('tooltip_div')
   .attr('class', 'tooltip')
   .style('opacity', 0)
   .style('display', 'none');

export const highlight = (d) => {

    let left = d3.event.pageX -20;
    let top = d3.event.pageY + 20;
 
    if (window.innerWidth - left < 150){
        left = d3.event.pageX - 40;
    }

    tooltip_div.transition()
        .duration(200)
        .style('opacity', .9);

    tooltip_div.html(tooltipHTML(d))
        .style('left', left + 'px')
        .style('top', top + 'px')
        .style('display', null);
};

export const tooltipHTML = (d) => {
    if (d.data.properties !== undefined) {
        let language = d3.select('#language').node().value;

        let labels = {
            valueLabel: { 'ro': 'cazuri legate', 'en': 'clustered cases' },
            cazulLabel: { 'ro': 'Cazul', 'en': 'Case' },
            maleLabel: { 'ro': 'Bărbat', 'en': 'Male' },
            femaleLabel: { 'ro': 'Femeie', 'en': 'Female' },
            unspecLabel: { 'ro': 'Gen nespecificat', 'en': 'Unspecified gender' },
            statusLabel: { 'ro': 'Stare', 'en': 'Status' },
            releasedLabel: { 'ro': 'vindecat', 'en': 'released' },
            confirmedLabel: { 'ro': 'confirmat', 'en': 'confirmed' },
            deceasedLabel: { 'ro': 'deces', 'en': 'deceased' },
            confdateLabel: { 'ro': 'Data confirmării', 'en': 'Confirmation date' },
            recoverydateLabel: { 'ro': 'Data recuperării', 'en': 'Recovery date' },
            infectionCountryLabel: { 'ro': 'Țara de infectare', 'en': 'Country of infection' },
            detailsLabel: { 'ro': 'Detalii', 'en': 'Details' },
            aiciLabel: { 'ro': 'aici', 'en': 'here' },
        };

        let cazuriInfo = d.value + ' ' + labels.valueLabel[language],
            genderInfo = d.data.properties.gender === 'Bărbat'
                ? labels.maleLabel[language]
                : (d.data.properties.gender === 'Femeie'
                    ? labels.femaleLabel[language]
                    : labels.unspecLabel[language]),
            ageInfo = d.data.properties.age != null && d.data.properties.age != 0
                ? (', ' + d.data.properties.age)
                : '',
            countyInfo = d.data.properties.county != null && d.data.properties.county != ''
                ? (', ' + d.data.properties.county)
                : '',
            statusInfo = d.data.properties.status != null
                ? (labels.statusLabel[language] + ': ' + (d.data.properties.status === 'Vindecat'
                        ? labels.releasedLabel[language]
                        : (d.data.properties.status === 'Confirmat'
                            ? labels.confirmedLabel[language]
                            : labels.deceasedLabel[language])) + '.<br />')
                : '',
            diagnosticDateInfo = d.data.properties.diagnostic_date !== null
                ? (labels.confdateLabel[language] + ': ' + d.data.properties.diagnostic_date + '.<br />')
                : '',
            healingDateInfo = d.data.properties.healing_date !== null
                ? (labels.recoverydateLabel[language] + ': ' + d.data.properties.healing_date + '.<br />')
                : '',
            countyOfInfectionInfo = d.data.properties.country_of_infection !== null 
                                    && d.data.properties.country_of_infection !== 'România'
                                    && d.data.properties.country_of_infection !== 'Romania'
                ? (labels.infectionCountryLabel[language] + ': ' + d.data.properties.country_of_infection + '.<br />')
                : '',
            referenceInfo = d.data.properties.reference !== null && d.data.properties.reference !== ''
                ? (labels.detailsLabel[language] + ': ' + '<a href="' + d.data.properties.reference + '" target= "_blank">'+ labels.aiciLabel[language] +'</a>')
                : '';

        // return '<b>' + labels.cazulLabel[language] + ' ' + d.data.properties.case_no + '</b>' +
        return '<b>' + labels.cazulLabel[language] + ' ' + 'x' + '</b>' +
            // genderInfo + ageInfo +
            countyInfo + '.<br />' +
            cazuriInfo + '.<br />' +
            statusInfo +
            diagnosticDateInfo +
            healingDateInfo +
            countyOfInfectionInfo +
            referenceInfo
        ;
    } else {
        return d.id;
    };
};

export const toggleInfo = (infoStatus, language) => {
    if (infoStatus === true) {
        tooltip_div.transition()
            .duration(200)
            .style('opacity', .9);
        tooltip_div.html(language === 'ro' ? '<strong>Clusterele de cazuri grupate pe județ</strong><br/><br/>Date de pe covid19.geo-spatial.org.<br/>Doar cazurile pentru care se cunoaște sursa de infectare.<br/><br/>Dați click în afara cercului pentru a deselecta.' : '<strong>Case clusters grouped by county</strong><br/><br/>Data from covid19.geo-spatial.org.<br/>Only cases with known infection source.<br/><br/>Click outside the circle to clear the selection.')
            .style('left', Config.width / 2 + 'px')
            .style('top', Config.height / 2 + 'px')
            .style('display', null);
        infoStatus = false;
    } else {
        tooltip_div.transition()
            .duration(200)
            .style('opacity', 0);
        infoStatus = true;
    }

    return infoStatus;
};

export const hovered = (hover) => {
    return (d) => {
        d3.selectAll(d.ancestors().map(d => d.node)).classed('node--hover', hover);
    };
};

export const hideTooltip = () => {
    tooltip_div.transition()
        .duration(200)
        .style("opacity", 0);
};