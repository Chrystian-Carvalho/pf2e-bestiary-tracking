export const slugify = (name) => {
    return name.toLowerCase().replaceAll(' ', '-').replaceAll('.','');
}

export const getCreatureSize = (size) => {
    switch(size){
        case 'grg':
            return 'Gargantuan';
        case 'huge':
            return 'Huge';
        case 'lg':
            return 'Large';
        case 'med':
            return 'Medium';
        case 'sm':
            return 'Small';
        case 'tiny':
            return 'Tiny';
    }
};

export const getMultiplesString = (mutliple) => {
    return mutliple.reduce((acc, curr, index) => acc.concat(`${index !== 0 ? index === mutliple.length-1 ? ' or ' : ', ' : ''}${curr}`), '');
};

export const getIWRString = (base, isResistance) => { // Mangled. Wtf.
    const baseString = base.type;
    const doubleVsString = base.doubleVs?.length > 0 ? `double ${isResistance ? 'resistance' : 'weakness'} ${getMultiplesString(base.doubleVs)}` : '';
    const exceptionsString = base.exceptions?.length > 0 ? `except ${getMultiplesString(base.exceptions)}` : '';

    return `${baseString}${doubleVsString || exceptionsString ? ` (${exceptionsString}${doubleVsString ? ';' : ''}${doubleVsString})` : ''}`
}

export const getCreaturesTypes = (traits, onlyActive) => {
    const creatureTypes = getExpandedCreatureTypes();
    const types = Object.keys(traits).reduce((acc, traitKey) => {
        if(Object.keys(creatureTypes).includes(traitKey)) acc.push({key: traitKey, revealed: traits[traitKey].revealed, name: creatureTypes[traitKey]});

        return acc;
    }, []);

    return onlyActive ? types.filter(x => x.revealed) : types; 
};

export const getExpandedCreatureTypes = () => {
    const allTypes = [
        ...Object.keys(CONFIG.PF2E.creatureTypes).map(type => ({ value: type, name: game.i18n.localize(CONFIG.PF2E.creatureTypes[type]) })),
        ...game.settings.get('pf2e-bestiary-tracking', 'additional-creature-types').map(type => ({ value: type.value, name: game.i18n.localize(type.name) })),
    ].sort((a, b) => {
        if(a.name < b.name) return -1;
        else if(a.name > b.name) return 1;
        else return 0;
    });
    
    const types = { unknown: { name: game.i18n.localize("PF2EBestiary.Bestiary.Miscellaneous.Unknown"), values: {} } };
    allTypes.forEach(type => {
        types[type.value] = { name: type.name, values: {} }
    });


    return types;
};