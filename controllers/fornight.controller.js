const Fornight = require('../models/fornight.model');
const _ = require('underscore')

const getFornights = async(req, res) => {

    try {
        const [fornightsDB, fornightCount] = await Promise.all([
            Fornight.find({ status: true })
            .populate('user', 'name email')
            .exec(),

            Fornight.countDocuments({ status: true })
        ]);

        res.json({
            status: true,
            count: fornightCount,
            fornights: fornightsDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                admin: {
                    msg: 'Error inesperado, favor revisar el Log del sistema.'
                }
            }
        });
    }

};

const createFornight = async(req, res) => {
    try {
        const body = req.body;

        const fornight = new Fornight({
            description: body.description,
            from: body.from,
            to: body.to,
            user: req.user.uid,
        });

        await fornight.save();

        res.json({
            status: true,
            fornight,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                admin: {
                    msg: 'Error inesperado, favor revisar el Log del sistema.'
                }
            }
        });
    }
};

const updateFornight = async(req, res) => {

    try {
        const id = req.params.id;
        const body = _.pick(req.body, ['description', 'from', 'to']);

        const fornightDB = await Fornight.findById(id);

        if (!fornightDB) {
            return res.status(404).json({
                status: false,
                error: {
                    msg: 'La quincena no existe en la BD'
                }
            });
        }

        if (!fornightDB.status || fornightDB.closed) {
            return res.status(400).json({
                status: false,
                error: {
                    msg: 'No es posible modificar una quincena en estado inactivo o cerrada.'
                }
            });
        }

        const fornightUpdated = await Fornight.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' });

        res.json({
            status: true,
            fornight: fornightUpdated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                admin: {
                    msg: 'Error inesperado, favor revisar el Log del sistema.'
                }
            }
        });
    }


}

const deleteFornight = async(req, res) => {

    try {
        let id = req.params.id;

        const fornightDeleted = await Fornight.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!fornightDeleted) {
            return res.status(404).json({
                status: false,
                error: {
                    msg: 'La quincena no exite en la Base de Datos.'
                }
            });
        }

        res.json({
            status: true,
            fornight: fornightDeleted
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                admin: {
                    msg: 'Error inesperado, favor revisar el Log del sistema.'
                }
            }
        });
    }

}

const closeFornight = async(req, res) => {

    try {
        const id = req.params.id;
        const fornightDB = await Fornight.findById(id);

        if (!fornightDB) {
            return res.status(404).json({
                status: false,
                error: {
                    msg: 'La quincena no existe en la BD'
                }
            });
        }

        if (!fornightDB.status) {
            return res.status(400).json({
                status: false,
                error: {
                    msg: 'No es posible cerrar una quincena en estado inactivo.'
                }
            });
        }

        const fornightClosed = await Fornight.findByIdAndUpdate(id, { closed: true }, { new: true, runValidators: true, context: 'query' });

        res.json({
            status: true,
            fornight: fornightClosed
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                admin: {
                    msg: 'Error inesperado, favor revisar el Log del sistema.'
                }
            }
        });
    }


}

module.exports = {
    getFornights,
    createFornight,
    updateFornight,
    deleteFornight,
    closeFornight
}