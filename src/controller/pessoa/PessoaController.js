const { getUUIDV4 } = require('../../app/util/UUIDGenerator')
const { serverError, ok, noContent, notFound, forbidden } = require('../../app/helpers/http/http-helpers')
const InvalidParamError = require('../../app/errors/invalid-param-error')

class PessoaController {

  constructor(app) {
    this.app = app
    this.repository = new this.app.src.db.repository.PessoaRepository(this.app)
  }

  async index(req) {
    try {
      const entities = await this.repository.findAll(req.body.attributes, req.body.filter, req.body.order)
      return entities.length > 0 ? ok(entities) : noContent()
    } catch (error) {
      serverError(error)
    }
  }

  async findAndPaginate(req) {
    try {
      const entities = await this.repository.findAndPaginate(req.body.attributes, req.body.filter, req.body.order, req.body.page)
      return entities.rows.length > 0 ? ok(entities) : noContent()
    } catch (error) {
      serverError(error)
    }
  }

  async findByUUId(req) {
    try {
      const entity = await this.repository.findByUUId(req.params.UUId)
      return entity ? ok(entity) : noContent()
    } catch (error) {
      serverError(error)
    }
  }

  async findById(req) {
    try {
      const entity = await this.repository.findById(req.params.id)
      return entity ? ok(entity) : noContent()
    } catch (error) {
      serverError(error)
    }
  }

  async insert(req) {
    try {
      const dados = req.body
      if (!dados.UUId) {
        dados.UUId = getUUIDV4()
      }

      const entity = await this.repository.insert(dados)
      return entity ? ok(entity) : notFound('Erro ao inserir o registro')
    } catch (error) {
      serverError(error)
    }
  }

  async update(req) {
    try {
      const dados = req.body
      if (!dados.id) {
        return forbidden(new InvalidParamError('ID é um campo obrigatório'))
      }

      const entity = await this.repository.update(dados)
      return entity ? ok(entity) : notFound('Registro não encontrado')
    } catch (error) {
      serverError(error)
    }
  }

  async delete(req) {
    try {
      const quantidadeDeletada = await this.repository.delete(req.params.id)
      return quantidadeDeletada > 0 ? ok(quantidadeDeletada) : notFound('Registro não encontrado')
    } catch (error) {
      serverError(error)
    }
  }
}

function retorno(app) {
  return new PessoaController(app)
}

module.exports = () => retorno
