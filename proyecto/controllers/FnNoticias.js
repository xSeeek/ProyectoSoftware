const Noticia = require('../models').Noticia;
const Area = require('../models').Area;

module.exports = {
    assignateArea(idNoticia, newAreas)
    {
        if(newAreas != null)
        {
            Noticia.findByPk(idNoticia)
                .then(async noticia=>{
                    var arrayAreas = JSON.parse(newAreas);
                    var flagExists = 1;
                    for(var index = 0; index < arrayAreas.length; index++)
                    {
                        flagExists = await (Area.findByPk(arrayAreas[index])
                            .then(area=>{
                                    if(!area)
                                        return 0; 
                                    return 1;
                                }));
                        if(flagExists == 1)
                            await (noticia.getAreas({through: {where: {idArea: arrayAreas[index]}}})
                            .then(areas=>{
                                console.log(noticia);
                                if(areas == null || areas.length == 0)
                                    noticia.addAreas(arrayAreas[index]).then(fn=>{});
                                }));
                    }
                })
                .catch(error => {return false;});
            return true;
        }
        return false;
    },
    unassignateArea(idUsuario, oldAreas)
    {
        if(oldAreas != null)
        {
            Noticia.findByPk(idNoticia)
                .then(async noticia=>{
                    var arrayAreas = JSON.parse(oldAreas);
                    var flagExists = 1;
                    for(var index = 0; index < arrayAreas.length; index++)
                    {
                        flagExists = await (Area.findByPk(arrayAreas[index])
                            .then(area=>{
                                    if(!area)
                                        return 0; 
                                    return 1;
                                }));
                        if(flagExists == 1)
                            await (noticia.getAreas({through: {where: {idArea: arrayAreas[index]}}})
                            .then(areas=>{
                                if(areas != null || areas.length != 0)
                                    noticia.removeAreas(arrayAreas[index]).then(fn=>{});
                                }));
                    }
                })
                .catch(error => {return false;});
            return true;
        }
        return false;
    }
};